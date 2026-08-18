const express = require('express');
const router = express.Router();
const {
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship
} = require('../controllers/scholarship.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.get('/', getScholarships);
router.post('/', protect, allowRoles('superadmin', 'manager'), createScholarship);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateScholarship);
router.delete('/:id', protect, allowRoles('superadmin'), deleteScholarship);

module.exports = router;