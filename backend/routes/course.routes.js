const express = require('express');
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/course.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.get('/', getCourses);
router.post('/', protect, allowRoles('superadmin', 'manager'), createCourse);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateCourse);
router.delete('/:id', protect, allowRoles('superadmin'), deleteCourse);

module.exports = router;