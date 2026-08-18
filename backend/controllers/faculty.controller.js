const Faculty = require('../models/Faculty.model');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'elitecollege/faculty' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Get all faculty (optional filter by department id)
// @route   GET /api/faculty?department=<id>
// @access  Public
exports.getFaculty = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) {
      filter.department = req.query.department;
    }
    const faculty = await Faculty.find(filter)
      .populate('department', 'name slug')
      .sort({ name: 1 });
    res.status(200).json({ success: true, count: faculty.length, data: faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty member
// @route   GET /api/faculty/:id
// @access  Public
exports.getFacultyById = async (req, res, next) => {
  try {
    const member = await Faculty.findById(req.params.id).populate('department', 'name slug');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Create faculty member
// @route   POST /api/faculty
// @access  Private (admin)
exports.createFaculty = async (req, res, next) => {
  try {
    const { name, designation, qualification, department, email, bio } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const member = await Faculty.create({
      name, designation, qualification, department, email, bio, image: imageUrl
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty member
// @route   PUT /api/faculty/:id
// @access  Private (admin)
exports.updateFaculty = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const member = await Faculty.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty member
// @route   DELETE /api/faculty/:id
// @access  Private (admin)
exports.deleteFaculty = async (req, res, next) => {
  try {
    const member = await Faculty.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }
    res.status(200).json({ success: true, message: 'Faculty member deleted' });
  } catch (error) {
    next(error);
  }
};