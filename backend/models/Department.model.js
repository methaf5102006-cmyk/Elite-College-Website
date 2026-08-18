const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "FiBook",
    },

    // NEW: department image shown on homepage cards / detail page
    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["undergraduate", "intermediate"],
      required: true,
    },

    tagline: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    affiliation: {
      type: String,
      default: "",
    },

    hod: {
      type: String,
      default: "",
    },

    // NEW: merit criteria, e.g. "50%"
    meritCriteria: {
      type: String,
      default: "",
    },

    // NEW: 5th-semester specialization tracks (e.g. BS CS -> AI, Data Science, IT, CS, Software Engineering)
    specializationTracks: [
      {
        type: String,
      },
    ],

    // NEW: short note explaining the specialization structure
    specializationNote: {
      type: String,
      default: "",
    },

    objectives: [
      {
        type: String,
      },
    ],

    coreAreas: [
      {
        type: String,
      },
    ],

    whyChoose: [
      {
        type: String,
      },
    ],

    careers: [
      {
        type: String,
      },
    ],

    furtherPathways: [
      {
        type: String,
      },
    ],

    eligibility: [
      {
        type: String,
      },
    ],

    courses: [
      {
        type: String,
      },
    ],

    // NEW: controls display order on the site (used for drag-and-drop reordering
    // in the admin panel). Lower numbers appear first.
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Department", departmentSchema);