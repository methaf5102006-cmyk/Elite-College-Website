const multer = require('multer');

// Store file in memory temporarily, then we upload it to Cloudinary manually in the controller
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;