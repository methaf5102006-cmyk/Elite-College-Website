const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const coreValueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

const aboutSchema = new mongoose.Schema({
  intro: {
    heading: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  history: {
    heading: { type: String, default: '' },
    description: { type: String, default: '' },
    milestones: [milestoneSchema]
  },
  leadershipMessage: {
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    message: { type: String, default: '' },
    image: { type: String, default: '' }
  },
  coreValues: [coreValueSchema]
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);