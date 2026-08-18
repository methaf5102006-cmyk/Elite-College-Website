const Notice = require("../models/Notice.model");

const getNotices = async (req, res, next) => {
  try {
    const { limit } = req.query;
    let query = Notice.find({ isActive: true }).sort({ date: -1 });
    if (limit) query = query.limit(Number(limit));
    const notices = await query;
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    next(error);
  }
};

const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      res.status(404);
      throw new Error("Notice not found");
    }
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const createNotice = async (req, res, next) => {
  try {
    const { title, description, date, isActive } = req.body;
    const notice = await Notice.create({ title, description, date, isActive });
    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notice) {
      res.status(404);
      throw new Error("Notice not found");
    }
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      res.status(404);
      throw new Error("Notice not found");
    }
    res.status(200).json({ success: true, message: "Notice deleted", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice };