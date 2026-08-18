const Scholarship = require('../models/Scholarship.model');

// @desc    Get all scholarships (public sees only active ones)
// @route   GET /api/scholarships
// @access  Public
exports.getScholarships = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const scholarships = await Scholarship.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: scholarships.length, data: scholarships });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a scholarship
// @route   POST /api/scholarships
// @access  Private (admin)
exports.createScholarship = async (req, res, next) => {
  try {
    const { title, description, eligibility, amount, deadline, isActive } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const scholarship = await Scholarship.create({ title, description, eligibility, amount, deadline, isActive });
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private (admin)
exports.updateScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private (admin)
exports.deleteScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    res.status(200).json({ success: true, message: 'Scholarship deleted' });
  } catch (error) {
    next(error);
  }
};