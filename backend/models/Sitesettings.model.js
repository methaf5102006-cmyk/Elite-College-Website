const mongoose = require('mongoose');

const dropdownItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
}, { _id: false });

const navLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  dropdown: { type: [dropdownItemSchema], default: [] },
}, { _id: false });

const footerLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  // Header
  logo: { type: String, default: '' }, // Cloudinary URL, falls back to local asset if empty
  collegeName: { type: String, default: 'Elite College of Management Sciences' },
  tagline: { type: String, default: 'Gujranwala' },
  address: { type: String, default: '49-A, Satellite Town, Gujranwala, Punjab' },
  phone: { type: String, default: '(055) 3256655' },
  email: { type: String, default: 'elite.colleges@gmail.com' },
  facebookUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  navLinks: { type: [navLinkSchema], default: [] },

  // Footer
  footerBlurb: { type: String, default: 'A Group serving since 1988 in the field of education.' },
  footerQuickLinks: { type: [footerLinkSchema], default: [] },
  footerResources: { type: [footerLinkSchema], default: [] },
  copyrightText: { type: String, default: 'EliteCollege. All rights reserved.' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);