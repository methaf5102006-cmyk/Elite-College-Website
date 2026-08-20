require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");


const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const activityLogger = require("./middleware/activityLogger.middleware");

// ------------------------------
// Connect to MongoDB Atlas
// ------------------------------
connectDB();

const app = express();

// ------------------------------
// Core Middleware
// ------------------------------
app.use(helmet()); // secure HTTP headers

// CORS: allow the fixed production origin (from CLIENT_URL), localhost for
// dev, and any *.vercel.app origin (covers preview deployments, which get a
// new URL on every push and would otherwise get blocked).
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://college-website-five-gilt.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      let hostname = "";
      try {
        hostname = new URL(origin).hostname;
      } catch (err) {
        return callback(new Error("Not allowed by CORS"));
      }

      const isAllowedExact = allowedOrigins.includes(origin);
      const isVercelPreview = hostname.endsWith(".vercel.app");
      const isNetlifyPreview = hostname.endsWith(".netlify.app");

      if (isAllowedExact || isVercelPreview || isNetlifyPreview) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // request logger
}

// Tracks every admin create/update/delete across all modules and
// emails superadmins when a manager makes a change. Must be mounted
// before the routes so it's part of each request's middleware chain
// (it only attaches a res.on('finish') listener, so it doesn't matter
// that `protect` — which sets req.user — runs later inside each route).
app.use(activityLogger);

// Rate limiting — protects against brute force / abuse
// In development, admin panel usage (loading settings + sections + departments +
// courses on every page load, drag-reorder actions, etc.) can easily fire 20-30+
// requests within seconds. We use a much higher limit locally and keep the strict
// one for production. You can still override both via .env if needed.
const isDev = process.env.NODE_ENV === "development";
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || (isDev ? 2000 : 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ------------------------------
// Health check route
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "College Website API is running",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------
// API Routes (added phase-by-phase)
// ------------------------------
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/about", require("./routes/about.routes"));

app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/about", require("./routes/about.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/courses", require("./routes/course.routes"));

app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/about", require("./routes/about.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/courses", require("./routes/course.routes"));
app.use("/api/faculty", require("./routes/faculty.routes"));
app.use("/api/faculty", require("./routes/faculty.routes"));
app.use("/api/facilities", require("./routes/facility.routes"));
app.use("/api/facilities", require("./routes/facility.routes"));
app.use("/api/gallery", require("./routes/gallery.routes"));

app.use("/api/gallery", require("./routes/gallery.routes"));
app.use("/api/contact", require("./routes/contact.routes"));
app.use('/api/admin-setup', require('./routes/adminSetup.routes'));
app.use("/api/news", require("./routes/news.routes"));
app.use("/api/admissions", require("./routes/admission.routes"));
app.use('/api/short-courses', require('./routes/shortCourse.routes'));
app.use('/api/sections', require('./routes/section.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/settings', require('./routes/siteSettingsRoutes'));
app.use('/api/scholarships', require('./routes/scholarship.routes'));
app.use('/api/activity-logs', require('./routes/activityLog.routes'));

// app.use("/api/admissions", require("./routes/admission.routes"));
// app.use("/api/faculty", require("./routes/faculty.routes"));
// app.use("/api/courses", require("./routes/course.routes"));
// app.use("/api/departments", require("./routes/department.routes"));
// app.use("/api/gallery", require("./routes/gallery.routes"));
// app.use("/api/contact", require("./routes/contact.routes"));
// ⬆️ Har phase mein jab route file banegi, uska require yahan uncomment karenge

// ------------------------------
// Error Handling (must be last)
// ------------------------------
app.use(notFound);
app.use(errorHandler);

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});