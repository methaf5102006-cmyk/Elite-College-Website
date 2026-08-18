const ContactQuery = require('../models/ContactQuery.model');
const sendEmail = require('../utils/sendEmail');

exports.submitContactQuery = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const query = await ContactQuery.create({ name, email, phone, message });

    if (process.env.SMTP_USER && process.env.ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Contact Query - ' + name,
          text: 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'N/A') + '\nMessage: ' + message
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError.message);
      }
    }

    res.status(201).json({ success: true, data: query });
  } catch (error) {
    next(error);
  }
};

exports.getContactQueries = async (req, res, next) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    next(error);
  }
};

exports.updateContactQueryStatus = async (req, res, next) => {
  try {
    const query = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }
    res.status(200).json({ success: true, data: query });
  } catch (error) {
    next(error);
  }
};