const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'hero',
        'featureHighlights',
        'directorMessage',
        'whyUs',
        'achievements',
        'quickLinks',
        'ourDepartments',
        'noticesSlider',
        'statsCounter',
        'custom',
      ],
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Section', sectionSchema);