const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage
} = require('../controllers/gallery.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getGalleryImages);
router.post('/', protect, allowRoles('superadmin', 'manager'), upload.single('image'), addGalleryImage);
router.delete('/:id', protect, allowRoles('superadmin'), deleteGalleryImage);

module.exports = router;