const Gallery = require('../models/Gallery.model');
const cloudinary = require('../config/cloudinary');

// Helper: upload a buffer to Cloudinary using a stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'elitecollege/gallery' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Get all gallery images (optional filter by category)
// @route   GET /api/gallery?category=Tour
// @access  Public
exports.getGalleryImages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a new gallery image
// @route   POST /api/gallery
// @access  Private (admin)
exports.addGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const image = await Gallery.create({
      title: req.body.title,
      category: req.body.category,
      imageUrl: result.secure_url,
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (admin)
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};