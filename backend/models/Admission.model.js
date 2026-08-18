const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  program: { type: String, required: true, trim: true }, // department name at time of submission
  message: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Enrolled', 'Rejected'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);