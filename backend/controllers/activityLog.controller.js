const ActivityLog = require('../models/ActivityLog.model');

// @desc    Get recent activity logs (newest first)
// @route   GET /api/activity-logs
// @access  Superadmin only
exports.getActivityLogs = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only the superadmin can view the activity log' });
    }

    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};