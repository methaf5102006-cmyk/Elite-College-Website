const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true }, // e.g. "Assistant Professor"
  qualification: { type: String, default: '' }, // e.g. "PhD Computer Science"
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  image: { type: String, default: '' }, // Cloudinary URL
  email: { type: String, default: '', trim: true, lowercase: true },
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);