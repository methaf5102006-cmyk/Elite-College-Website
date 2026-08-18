const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const PendingManager = require('../models/PendingManager.model');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const notifySuperadmins = require('../utils/notifySuperadmins');

// @desc    Admin login
// @route   POST /api/auth/login
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Notify superadmins whenever a manager logs in (fire-and-forget, never blocks the response)
    if (user.role === 'manager') {
      notifySuperadmins({
        subject: `Manager Login: ${user.name}`,
        html: `
          <p><b>${user.name}</b> (${user.email}) has logged into their manager account.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in admin profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 1 — manager details submit, OTP email
// @route   POST /api/auth/create-manager/initiate
exports.initiateCreateManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    await PendingManager.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingManager.create({ name, email, password, otp });

    await sendEmail({
      to: email,
      subject: 'Verify your Elite College Manager Account',
      html: `<p>Hi ${name},</p><p>Your OTP code is: <b>${otp}</b></p><p>This will expire in 10 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: `An OTP has been sent to ${email}. Please verify it to activate the account.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 2 — OTP verify, actual manager account banao
// @route   POST /api/auth/create-manager/verify
exports.verifyManagerOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const pending = await PendingManager.findOne({ email });
    if (!pending) {
      return res.status(400).json({ success: false, message: 'OTP has expired or no request was found. Please try again.' });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }

    const newManager = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: 'manager',
    });

    await PendingManager.deleteOne({ _id: pending._id });

    res.status(201).json({
      success: true,
      data: {
        _id: newManager._id,
        name: newManager.name,
        email: newManager.email,
        role: newManager.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Saare managers ki list
// @route   GET /api/auth/managers
exports.getManagers = async (req, res, next) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password');
    res.status(200).json({ success: true, data: managers });
  } catch (error) {
    next(error);
  }
};

// @desc    Manager ka naam/email edit karo
// @route   PUT /api/auth/managers/:id
exports.updateManager = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const manager = await User.findOne({ _id: req.params.id, role: 'manager' });
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    if (email && email !== manager.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
      }
      manager.email = email;
    }

    if (name) manager.name = name;

    await manager.save();

    res.status(200).json({
      success: true,
      data: { _id: manager._id, name: manager.name, email: manager.email, role: manager.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manager ka password change karo (superadmin directly, no OTP)
// @route   PUT /api/auth/managers/:id/password
exports.changeManagerPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const manager = await User.findOne({ _id: req.params.id, role: 'manager' });
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    manager.password = newPassword; // pre-save hook khud hash kar dega
    await manager.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Manager delete karo
// @route   DELETE /api/auth/managers/:id
exports.deleteManager = async (req, res, next) => {
  try {
    const manager = await User.findOne({ _id: req.params.id, role: 'manager' });

    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    await manager.deleteOne();

    res.status(200).json({ success: true, message: 'Manager deleted successfully' });
  } catch (error) {
    next(error);
  }
};