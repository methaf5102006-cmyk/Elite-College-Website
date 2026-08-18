const User = require('../models/User.model');
const sendEmail = require('./sendEmail');

/**
 * Sends an email to every user with role 'superadmin'.
 * Never throws — logs the error instead, so it never breaks the
 * request that triggered it (login, create, update, delete, etc.).
 */
const notifySuperadmins = async ({ subject, html }) => {
  try {
    const superadmins = await User.find({ role: 'superadmin' }).select('email');
    if (superadmins.length === 0) return;

    await sendEmail({
      to: superadmins.map((s) => s.email).join(','),
      subject,
      html,
    });
  } catch (err) {
    console.error('Failed to notify superadmins:', err.message);
  }
};

module.exports = notifySuperadmins;