const About = require('../models/About.model');

// @desc    Get About content
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    res.status(200).json({ success: true, data: about || null });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Update About content (singleton — upsert)
// @route   PUT /api/about
// @access  Temporary: Public (Auth Phase 6 mein protect hoga)
exports.updateAbout = async (req, res, next) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};