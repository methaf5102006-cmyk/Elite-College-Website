const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { protect, allowRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", protect, allowRoles("superadmin", "manager"), upload.array("images", 10), createEvent);
router.put("/:id", protect, allowRoles("superadmin", "manager"), upload.array("images", 10), updateEvent);
router.delete("/:id", protect, allowRoles("superadmin"), deleteEvent);

module.exports = router;