const Event = require("../models/Event.model");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "elitecollege/events" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadManyToCloudinary = async (files = []) => {
  const uploads = await Promise.all(files.map((file) => uploadToCloudinary(file.buffer)));
  return uploads.map((result) => result.secure_url);
};

const getEvents = async (req, res, next) => {
  try {
    const { filter, limit } = req.query;
    const now = new Date();
    let dateQuery = {};
    if (filter === "upcoming") dateQuery = { eventDate: { $gte: now } };
    else if (filter === "past") dateQuery = { eventDate: { $lt: now } };

    let query = Event.find(dateQuery).sort({ eventDate: filter === "past" ? -1 : 1 });
    if (limit) query = query.limit(Number(limit));
    const events = await query;
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, eventDate, location } = req.body;

    // req.files comes from upload.array('images', N) in the route middleware
    const images = req.files && req.files.length > 0 ? await uploadManyToCloudinary(req.files) : [];

    const event = await Event.create({ title, description, eventDate, location, images });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { title, description, eventDate, location, existingImages } = req.body;

    // Images the admin chose to keep (sent as a JSON string from the frontend)
    let keptImages = [];
    if (existingImages) {
      try {
        keptImages = JSON.parse(existingImages);
      } catch (err) {
        keptImages = [];
      }
    }

    // Newly uploaded images (if any)
    const newImages = req.files && req.files.length > 0 ? await uploadManyToCloudinary(req.files) : [];

    const updateData = {
      title,
      description,
      eventDate,
      location,
      images: [...keptImages, ...newImages],
    };

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.status(200).json({ success: true, message: "Event deleted", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };