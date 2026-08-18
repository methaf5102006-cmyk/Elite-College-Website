const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    role: { type: String, default: '' },
    module: { type: String, required: true },   // e.g. "Facility", "Event", "Gallery Image"
    action: { type: String, required: true },   // "created" | "updated" | "deleted"
    method: { type: String, required: true },   // "POST" | "PUT" | "PATCH" | "DELETE"
    path: { type: String, required: true },
    statusCode: { type: Number },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);