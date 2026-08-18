const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'elitecollege/home-sections' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Upload a single image, return its URL (not tied to any model)
// @route   POST /api/upload
// @access  Private (admin)
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.status(201).json({ success: true, data: { url: result.secure_url } });
  } catch (error) {
    next(error);
  }
};