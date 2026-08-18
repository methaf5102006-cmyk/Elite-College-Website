const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLog.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

router.get('/', protect, isAdmin, getActivityLogs);

module.exports = router;