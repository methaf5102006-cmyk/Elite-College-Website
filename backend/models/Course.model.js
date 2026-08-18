const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true }, // frontend "title"
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  icon: { type: String, default: 'FiCode' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: false },
  duration: { type: String, required: true },
  eligibility: { type: String, default: '' },
  description: { type: String, default: '' },
  topics: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);