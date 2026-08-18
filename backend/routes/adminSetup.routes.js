const express = require('express');
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  setupStatus,
  requestChangeOtp,
  verifyChangeOtp,
  requestPasswordReset,
  resetPassword
} = require('../controllers/adminSetup.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/status', setupStatus);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Change account — requires an existing logged-in admin
router.post('/request-change', protect, requestChangeOtp);
router.post('/verify-change', protect, verifyChangeOtp);

// Forgot password — public, no login required
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;