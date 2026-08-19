const express = require('express');
const router = express.Router();
const {
  getSiteSettings,
  updateSiteSettings
} = require('../controllers/SiteSettings.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

router.get('/', getSiteSettings);
router.put('/', protect, isAdmin, updateSiteSettings);

module.exports = router;