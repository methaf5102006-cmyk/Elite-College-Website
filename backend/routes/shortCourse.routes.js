const express = require('express');
const router = express.Router();
const {
  getShortCourses,
  getShortCourseBySlug,
  createShortCourse,
  updateShortCourse,
  deleteShortCourse,
} = require('../controllers/shortCourse.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.route('/')
  .get(getShortCourses)
  .post(protect, allowRoles('superadmin', 'manager'), createShortCourse);

router.route('/:slug').get(getShortCourseBySlug);

router.route('/:id')
  .put(protect, allowRoles('superadmin', 'manager'), updateShortCourse)
  .delete(protect, allowRoles('superadmin'), deleteShortCourse);

module.exports = router;