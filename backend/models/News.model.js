const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  website: { type: String, trim: true },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  category: { type: String, required: true, trim: true, default: 'Activities' },
  author: { type: String, required: true, trim: true, default: 'Elite College Admin' },
  image: { type: String, required: true },
  body: [{ type: String, required: true }], // array of paragraphs
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);