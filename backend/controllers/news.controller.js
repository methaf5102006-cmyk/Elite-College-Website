const News = require('../models/News.model');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'elitecollege/news' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Simple slug generator from title
const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// @desc    Get all news items
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res, next) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news item by slug
// @route   GET /api/news/:slug
// @access  Public
exports.getNewsBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new news item
// @route   POST /api/news
// @access  Private (admin)
exports.addNews = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const { title, category, author } = req.body;
    // body comes as a single textarea with paragraphs separated by blank lines
    const bodyParagraphs = req.body.body
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let slug = generateSlug(title);
    const existing = await News.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const news = await News.create({
      title,
      slug,
      category: category || 'Activities',
      author: author || 'Elite College Admin',
      image: result.secure_url,
      body: bodyParagraphs,
    });

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a news item
// @route   DELETE /api/news/:id
// @access  Private (admin)
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }
    res.status(200).json({ success: true, message: 'News item deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a news item
// @route   POST /api/news/:slug/comments
// @access  Public
exports.addComment = async (req, res, next) => {
  try {
    const { name, email, website, comment } = req.body;

    if (!name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'Name, email and comment are required' });
    }

    const news = await News.findOne({ slug: req.params.slug });
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    news.comments.push({ name, email, website, comment });
    await news.save();

    res.status(201).json({ success: true, data: news.comments[news.comments.length - 1] });
  } catch (error) {
    next(error);
  }
};