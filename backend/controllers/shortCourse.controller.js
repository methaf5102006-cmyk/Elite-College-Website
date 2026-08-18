const ShortCourse = require('../models/ShortCourse.model');

// @desc    Get all short courses
// @route   GET /api/short-courses
// @access  Public
exports.getShortCourses = async (req, res, next) => {
  try {
    const shortCourses = await ShortCourse.find().sort({ title: 1 });
    res.status(200).json({ success: true, count: shortCourses.length, data: shortCourses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single short course by slug
// @route   GET /api/short-courses/:slug
// @access  Public
exports.getShortCourseBySlug = async (req, res, next) => {
  try {
    const shortCourse = await ShortCourse.findOne({ slug: req.params.slug });
    if (!shortCourse) {
      return res.status(404).json({ success: false, message: 'Short course not found' });
    }
    res.status(200).json({ success: true, data: shortCourse });
  } catch (error) {
    next(error);
  }
};

// @desc    Create short course
// @route   POST /api/short-courses
// @access  Admin (temporary: open)
exports.createShortCourse = async (req, res, next) => {
  try {
    const shortCourse = await ShortCourse.create(req.body);
    res.status(201).json({ success: true, data: shortCourse });
  } catch (error) {
    next(error);
  }
};

// @desc    Update short course
// @route   PUT /api/short-courses/:id
// @access  Admin (temporary: open)
exports.updateShortCourse = async (req, res, next) => {
  try {
    const shortCourse = await ShortCourse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!shortCourse) {
      return res.status(404).json({ success: false, message: 'Short course not found' });
    }
    res.status(200).json({ success: true, data: shortCourse });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete short course
// @route   DELETE /api/short-courses/:id
// @access  Admin (temporary: open)
exports.deleteShortCourse = async (req, res, next) => {
  try {
    const shortCourse = await ShortCourse.findByIdAndDelete(req.params.id);
    if (!shortCourse) {
      return res.status(404).json({ success: false, message: 'Short course not found' });
    }
    res.status(200).json({ success: true, message: 'Short course deleted' });
  } catch (error) {
    next(error);
  }
};