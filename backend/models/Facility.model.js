const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: '' }, // react-icons/fa name, e.g. "FaBook"
  images: { type: [String], default: [] }, // optional Cloudinary URLs
  order: { type: Number, default: 0 } // display order
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);