const Admission = require('../models/Admission.model');
const sendEmail = require('../utils/sendEmail'); // adjust path if different

// @desc    Submit a new admission application
// @route   POST /api/admissions
// @access  Public
exports.createAdmission = async (req, res, next) => {
  try {
    const { fullName, email, phone, program, message } = req.body;

    if (!fullName || !email || !phone || !program) {
      return res.status(400).json({ success: false, message: 'Full name, email, phone and program are required' });
    }

    const admission = await Admission.create({ fullName, email, phone, program, message });
    res.status(201).json({ success: true, message: 'Application submitted successfully', data: admission });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admission applications
// @route   GET /api/admissions
// @access  Private (admin)
exports.getAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: admissions.length, data: admissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Check application status by email
// @route   GET /api/admissions/check-status?email=someone@example.com
// @access  Public
exports.checkAdmissionStatus = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const admissions = await Admission.find({ email: email.toLowerCase().trim() }).sort({ createdAt: -1 });

    if (!admissions || admissions.length === 0) {
      return res.status(404).json({ success: false, message: 'No application found with this email' });
    }

    res.status(200).json({ success: true, count: admissions.length, data: admissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/admissions/:id
// @access  Private (admin)
exports.updateAdmission = async (req, res, next) => {
  try {
    const previous = await Admission.findById(req.params.id);
    if (!previous) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    // Send email only if status actually changed to Enrolled or Rejected
    if (req.body.status && req.body.status !== previous.status) {
      if (req.body.status === 'Enrolled') {
        await sendEmail({
          to: admission.email,
          subject: 'Your Admission Application - Update',
          text: `Dear ${admission.fullName}, congratulations! Your application for ${admission.program} has been accepted. Our team will contact you soon with further details.`,
          html: `<p>Dear ${admission.fullName},</p>
                 <p>Congratulations! Your application for <strong>${admission.program}</strong> has been <strong>accepted</strong>.</p>
                 <p>Our team will contact you soon with further details.</p>
                 <p>Regards,<br/>EliteCollege Admissions Team</p>`
        });
      } else if (req.body.status === 'Rejected') {
        await sendEmail({
          to: admission.email,
          subject: 'Your Admission Application - Update',
          text: `Dear ${admission.fullName}, thank you for applying for ${admission.program}. Unfortunately, we are unable to offer you admission at this time.`,
          html: `<p>Dear ${admission.fullName},</p>
                 <p>Thank you for applying for <strong>${admission.program}</strong>.</p>
                 <p>Unfortunately, we are unable to offer you admission at this time.</p>
                 <p>Regards,<br/>EliteCollege Admissions Team</p>`
        });
      }
    }

    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/admissions/:id
// @access  Private (admin)
exports.deleteAdmission = async (req, res, next) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    next(error);
  }
};