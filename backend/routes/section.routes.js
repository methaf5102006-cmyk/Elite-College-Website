const express = require('express');
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} = require('../controllers/section.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.get('/', getSections);
router.put('/reorder', protect, allowRoles('superadmin', 'manager'), reorderSections);
router.post('/', protect, allowRoles('superadmin', 'manager'), createSection);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateSection);
router.delete('/:id', protect, allowRoles('superadmin'), deleteSection);

module.exports = router;