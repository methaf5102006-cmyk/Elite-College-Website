const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Annual Function',
      'Bonfire Night',
      'Tour',
      'Exam Session',
      'Sessions',
      'PTM',
      'Convocation',
      'Thesis Projects',
      'Campus Life'
    ],
    default: 'Campus Life'
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);