const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/about.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.get('/', getAbout);
router.put('/', protect, allowRoles('superadmin', 'manager'), updateAbout);

module.exports = router;