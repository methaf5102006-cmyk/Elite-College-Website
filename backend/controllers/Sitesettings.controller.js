const SiteSettings = require('../models/SiteSettings.model');

// @desc    Get site settings (header + footer content)
// @route   GET /api/settings
// @access  Public
exports.getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    // Auto-create a default document the very first time this is called
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings (header + footer content)
// @route   PUT /api/settings
// @access  Admin
exports.updateSiteSettings = async (req, res, next) => {
  try {
    // upsert:true means if no document exists yet, one is created with this data
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};