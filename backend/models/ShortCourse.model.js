const mongoose = require('mongoose');

const shortCourseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'FiBook',
    },
    duration: {
      type: String,
      required: true, // e.g. "3 Months", "6 Weeks"
    },
    description: {
      type: String,
      default: '',
    },
    topics: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ShortCourse', shortCourseSchema);