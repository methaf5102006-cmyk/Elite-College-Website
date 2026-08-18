const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Otp = require('../models/Otp.model');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// @desc    Step 1 — Admin provides name, email, password; OTP sent to email
// @route   POST /api/admin-setup/request-otp
// @access  Public (only works if no admin exists yet)
exports.requestOtp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(403).json({ success: false, message: 'Admin account already exists. Please use the login page.' });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ name, email: email.toLowerCase(), password, otp, expiresAt });

    await sendEmail({
      to: email,
      subject: 'EliteCollege Admin Setup — OTP Verification',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your EliteCollege admin setup OTP is:</p><h2>${otp}</h2><p>This will expire in 10 minutes. If you did not request this, please ignore this email.</p>`
    });

    res.status(200).json({ success: true, message: 'OTP has been sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 2 — Verify OTP, create the User record
// @route   POST /api/admin-setup/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      await Otp.deleteMany({ email: email.toLowerCase() });
      return res.status(403).json({ success: false, message: 'Admin account already exists. Please use the login page.' });
    }

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      role: 'admin'
    });

    await Otp.deleteMany({ email: email.toLowerCase() });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Admin account created',
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check whether an admin account already exists (used by frontend to decide which page to show)
// @route   GET /api/admin-setup/status
// @access  Public
exports.setupStatus = async (req, res, next) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    res.status(200).json({ success: true, setupDone: !!existingAdmin });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 1 of changing admin account — logged-in admin confirms current password, provides new details, OTP sent to NEW email
// @route   POST /api/admin-setup/request-change
// @access  Private (logged-in admin only)
exports.requestChangeOtp = async (req, res, next) => {
  try {
    const { currentPassword, name, newEmail, newPassword } = req.body;

    if (!currentPassword || !name || !newEmail || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    // req.user was set by the `protect` middleware but has password excluded, so re-fetch with password
    const currentAdmin = await User.findById(req.user._id).select('+password');
    const adminWithPassword = currentAdmin.password
      ? currentAdmin
      : await User.findById(req.user._id); // fallback in case select('-password') is the schema default and +password doesn't override

    const isMatch = await adminWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await Otp.deleteMany({ email: newEmail.toLowerCase() });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({ name, email: newEmail.toLowerCase(), password: newPassword, otp, expiresAt });

    await sendEmail({
      to: newEmail,
      subject: 'EliteCollege Admin — Confirm Account Change',
      text: `Your OTP to confirm this admin account change is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP to confirm this admin account change is:</p><h2>${otp}</h2><p>This will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>`
    });

    res.status(200).json({ success: true, message: 'OTP has been sent to the new email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 2 of changing admin account — verify OTP sent to new email, update the existing admin record
// @route   POST /api/admin-setup/verify-change
// @access  Private (logged-in admin only)
exports.verifyChangeOtp = async (req, res, next) => {
  try {
    const { newEmail, otp } = req.body;

    if (!newEmail || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email: newEmail.toLowerCase(), otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const admin = await User.findById(req.user._id);
    admin.name = otpRecord.name;
    admin.email = otpRecord.email;
    admin.password = otpRecord.password; // pre-save hook will hash this
    await admin.save();

    await Otp.deleteMany({ email: newEmail.toLowerCase() });

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin account updated successfully',
      data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 1 of forgot password — admin provides email, OTP sent to that email
// @route   POST /api/admin-setup/forgot-password
// @access  Public
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No admin account found with this email' });
    }

    await Otp.deleteMany({ email: email.toLowerCase() });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({
      name: admin.name,
      email: email.toLowerCase(),
      password: 'PENDING_RESET',
      otp,
      expiresAt
    });

    await sendEmail({
      to: admin.email,
      subject: 'EliteCollege Admin — Password Reset OTP',
      text: `Your OTP to reset your admin password is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP to reset your admin password is:</p><h2>${otp}</h2><p>This will expire in 10 minutes. If you did not request this, please ignore this email or secure your account.</p>`
    });

    res.status(200).json({ success: true, message: 'OTP has been sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 2 of forgot password — verify OTP and set the new password
// @route   POST /api/admin-setup/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    admin.password = newPassword; // pre-save hook will hash this
    await admin.save();

    await Otp.deleteMany({ email: email.toLowerCase() });

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token }
    });
  } catch (error) {
    next(error);
  }
};