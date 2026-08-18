const mongoose = require('mongoose');

const pendingManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true }, // already hashed before saving
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 min baad auto-delete (TTL index)
});

module.exports = mongoose.model('PendingManager', pendingManagerSchema);