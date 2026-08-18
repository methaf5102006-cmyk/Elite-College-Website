const express = require("express");
const router = express.Router();
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/notice.controller");
const { protect, allowRoles } = require("../middleware/auth.middleware");

router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.post("/", protect, allowRoles("superadmin", "manager"), createNotice);
router.put("/:id", protect, allowRoles("superadmin", "manager"), updateNotice);
router.delete("/:id", protect, allowRoles("superadmin"), deleteNotice);

module.exports = router;