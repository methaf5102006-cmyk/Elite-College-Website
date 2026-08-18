const express = require('express');
const router = express.Router();
const {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facility.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.get('/', getFacilities);
router.post('/', protect, allowRoles('superadmin', 'manager'), createFacility);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateFacility);
router.delete('/:id', protect, allowRoles('superadmin'), deleteFacility);

module.exports = router;