const express = require('express');
const router = express.Router();
const {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/faculty.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getFaculty);
router.get('/:id', getFacultyById);
router.post('/', protect, allowRoles('superadmin', 'manager'), upload.single('image'), createFaculty);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), upload.single('image'), updateFaculty);
router.delete('/:id', protect, allowRoles('superadmin'), deleteFaculty);

module.exports = router;