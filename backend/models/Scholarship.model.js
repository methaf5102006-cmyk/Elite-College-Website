const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  eligibility: { type: String, trim: true, default: '' },
  amount: { type: String, trim: true, default: '' }, // e.g. "50% fee waiver" or "Rs. 20,000"
  deadline: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);