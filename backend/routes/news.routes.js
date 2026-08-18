const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsBySlug,
  addNews,
  deleteNews,
  addComment
} = require('../controllers/news.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);
router.post('/', protect, allowRoles('superadmin', 'manager'), upload.single('image'), addNews);
router.delete('/:id', protect, allowRoles('superadmin'), deleteNews);
router.post('/:slug/comments', addComment);

module.exports = router;