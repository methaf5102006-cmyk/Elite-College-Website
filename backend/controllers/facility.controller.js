const Facility = require('../models/Facility.model');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public
exports.getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    next(error);
  }
};

// @desc    Create facility
// @route   POST /api/facilities
// @access  Admin (temporary: open)
exports.createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Admin (temporary: open)
exports.updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Admin (temporary: open)
exports.deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, message: 'Facility deleted' });
  } catch (error) {
    next(error);
  }
};