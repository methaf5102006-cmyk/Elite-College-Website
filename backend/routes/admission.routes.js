const express = require('express');
const router = express.Router();
const {
  createAdmission,
  getAdmissions,
  checkAdmissionStatus,
  updateAdmission,
  deleteAdmission
} = require('../controllers/admission.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.post('/', createAdmission);
router.get('/check-status', checkAdmissionStatus); // public — must stay above any GET '/:id' route if you add one later
router.get('/', protect, allowRoles('superadmin', 'manager'), getAdmissions);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateAdmission);
router.delete('/:id', protect, allowRoles('superadmin'), deleteAdmission);

module.exports = router;