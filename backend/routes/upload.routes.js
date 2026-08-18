const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/upload.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', protect, allowRoles('superadmin', 'manager'), upload.single('image'), uploadImage);

module.exports = router;