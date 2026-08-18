const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/department.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

// Public routes (home page ke liye)
router.get('/', getDepartments);
router.get('/:slug', getDepartmentBySlug);

// Protected routes
router.post('/', protect, allowRoles('superadmin', 'manager'), createDepartment);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateDepartment);
router.delete('/:id', protect, allowRoles('superadmin'), deleteDepartment);

module.exports = router;