const Section = require('../models/Section.model');

// @desc    Get all sections (public: only active, sorted by order)
// @route   GET /api/sections
// @access  Public
exports.getSections = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const sections = await Section.find(filter).sort({ order: 1 });
    res.status(200).json({ success: true, count: sections.length, data: sections });
  } catch (error) {
    next(error);
  }
};

// @desc    Create section
// @route   POST /api/sections
// @access  Admin
exports.createSection = async (req, res, next) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// @desc    Update section
// @route   PUT /api/sections/:id
// @access  Admin
exports.updateSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Admin
exports.deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.status(200).json({ success: true, message: 'Section deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder sections (bulk update order)
// @route   PUT /api/sections/reorder
// @access  Admin
exports.reorderSections = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // array of section _ids in new order
    await Promise.all(
      orderedIds.map((id, index) => Section.findByIdAndUpdate(id, { order: index }))
    );
    const sections = await Section.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};