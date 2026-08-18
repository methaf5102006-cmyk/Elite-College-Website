const ActivityLog = require('../models/ActivityLog.model');
const notifySuperadmins = require('../utils/notifySuperadmins');

// Maps URL path segments to friendly module names for the log & email text.
// Anything not listed here just falls back to a capitalized version of the segment.
const MODULE_LABELS = {
  facilities: 'Facility',
  events: 'Event',
  gallery: 'Gallery Image',
  news: 'News',
  notices: 'Notice',
  faculty: 'Faculty',
  departments: 'Department',
  courses: 'Course',
  'short-courses': 'Short Course',
  admissions: 'Admissions',
  scholarships: 'Scholarship',
  sections: 'Home Section',
  about: 'About Page',
  settings: 'Site Settings',
  contact: 'Contact Info',
};

const ACTION_LABELS = {
  POST: 'created',
  PUT: 'updated',
  PATCH: 'updated',
  DELETE: 'deleted',
};

// Routes we deliberately do NOT want to log as "content changes"
// (auth flows, the raw file-upload endpoint, health checks, admin bootstrap)
const SKIP_SEGMENTS = ['auth', 'upload', 'health', 'admin-setup', 'activity-logs'];

const activityLogger = (req, res, next) => {
  res.on('finish', async () => {
    try {
      // Only mutations matter for the activity log
      if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return;

      // Only log successful operations
      if (res.statusCode < 200 || res.statusCode >= 300) return;

      // `protect` middleware (earlier in the route's own chain) sets req.user.
      // By the time the response finishes, it will be populated if the route was authenticated.
      if (!req.user) return;

      const segment = req.originalUrl.split('/')[2]; // "/api/facilities/xyz" -> "facilities"
      if (!segment || SKIP_SEGMENTS.includes(segment)) return;

      const moduleLabel = MODULE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const actionLabel = ACTION_LABELS[req.method] || req.method;

      await ActivityLog.create({
        user: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        role: req.user.role,
        module: moduleLabel,
        action: actionLabel,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
      });

      // Only email superadmins for changes made by managers (not for superadmin's own actions)
      if (req.user.role === 'manager') {
        notifySuperadmins({
          subject: `Manager Activity: ${moduleLabel} ${actionLabel}`,
          html: `
            <p><b>${req.user.name}</b> (${req.user.email}) has ${actionLabel} <b>${moduleLabel}</b>.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
          `,
        });
      }
    } catch (err) {
      console.error('activityLogger error:', err.message);
    }
  });

  next();
};

module.exports = activityLogger;