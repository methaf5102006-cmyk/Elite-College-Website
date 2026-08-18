const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getMe,
  initiateCreateManager,
  verifyManagerOtp,
  getManagers,
  updateManager,
  changeManagerPassword,
  deleteManager,
} = require('../controllers/auth.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

router.post('/create-manager/initiate', protect, allowRoles('superadmin'), initiateCreateManager);
router.post('/create-manager/verify', protect, allowRoles('superadmin'), verifyManagerOtp);

router.get('/managers', protect, allowRoles('superadmin'), getManagers);
router.put('/managers/:id', protect, allowRoles('superadmin'), updateManager);
router.put('/managers/:id/password', protect, allowRoles('superadmin'), changeManagerPassword);
router.delete('/managers/:id', protect, allowRoles('superadmin'), deleteManager);

module.exports = router;