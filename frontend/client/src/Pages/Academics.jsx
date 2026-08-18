import { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu, FiWifi, FiBook, FiUserCheck, FiActivity, FiHeart, FiTool,
  FiBarChart2, FiMonitor, FiShield, FiPenTool, FiCode, FiLayout,
  FiFileText, FiMessageCircle, FiChevronDown,
} from "react-icons/fi";
import { getDepartments } from "../services/departmentService";
import { getShortCourses } from "../services/shortCourseService";
import Tilt3D from "../components/common/Tilt3D";
import AnimatedText from "../components/common/AnimatedText";
import CourseModal from "../components/common/CourseModal";

const ICONS = {
  FiCpu, FiWifi, FiBook, FiUserCheck, FiActivity, FiHeart, FiTool,
  FiBarChart2, FiMonitor, FiShield, FiPenTool, FiCode, FiLayout,
  FiFileText, FiMessageCircle,
};

const CATEGORIES = [
  { key: "undergraduate", label: "Undergraduate Programs" },
  { key: "intermediate", label: "Intermediate Programs" },
  { key: "computer-courses", label: "Computer Courses" },
];

// ---- shared animation variants ----
const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const Academics = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.some((c) => c.key === urlCategory) ? urlCategory : "undergraduate"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (CATEGORIES.some((c) => c.key === urlCategory)) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptData, courseData] = await Promise.all([getDepartments(), getShortCourses()]);
        setDepartments(deptData);
        setCourses(courseData);
      } catch (err) {
        console.error("Failed to load academics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label;

  const items =
    activeCategory === "computer-courses"
      ? courses
      : departments.filter((d) => d.category === activeCategory);

  return (
    <main className="bg-parchment min-h-screen overflow-hidden">
      {/* ---------- HERO ---------- */}
      <section className="relative bg-ink text-parchment py-16 px-6 text-center overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-28 -right-14 w-80 h-80 rounded-full bg-gold-dark/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <AnimatedText
          as="h1"
          className="font-display text-4xl md:text-5xl mb-3 relative z-10"
        >
          Academics
        </AnimatedText>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          Explore our departments and the programs we offer.
        </motion.p>
      </section>

      {/* ---------- CONTENT ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-ink/10 rounded-xl text-ink font-medium text-sm shadow-sm hover:border-gold transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeLabel}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {activeLabel}
              </motion.span>
            </AnimatePresence>
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <FiChevronDown size={16} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-10 mt-2 w-56 bg-white border border-ink/10 rounded-xl shadow-md overflow-hidden origin-top"
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    whileHover={{ x: 4 }}
                    onClick={() => { setActiveCategory(cat.key); setDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                      activeCategory === cat.key
                        ? "bg-ink text-parchment"
                        : "text-charcoal hover:bg-parchment dark:text-parchment dark:hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading state */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-48 rounded-2xl bg-white border border-ink/10 overflow-hidden relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
              variants={gridContainer}
            >
              {/* Departments (undergraduate / intermediate) */}
              {activeCategory !== "computer-courses" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-slate col-span-full text-center"
                    >
                      No programs have been added to this category yet.
                    </motion.p>
                  ) : (
                    items.map((dept) => {
                      const Icon = ICONS[dept.icon];
                      return (
                        <motion.div key={dept.slug} variants={cardItem}>
                          <NavLink to={`/departments/${dept.slug}`} className="block h-full">
                            <Tilt3D className="group bg-white border border-ink/10 rounded-2xl p-6 flex flex-col h-full hover:border-gold hover:shadow-md transition-colors duration-300">
                              <motion.div
                                whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.12 }}
                                transition={{ duration: 0.5 }}
                                className="w-12 h-12 mb-4 rounded-full bg-parchment flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300"
                              >
                                {Icon && <Icon className="text-gold-dark" size={22} />}
                              </motion.div>
                              <h3 className="font-display text-lg font-semibold text-ink mb-2">
                                {dept.name}
                              </h3>
                              <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">
                                {dept.tagline}
                              </p>
                              <div className="mt-auto flex items-center justify-between text-xs text-slate">
                                <span>{dept.duration}</span>
                                <motion.span
                                  className="text-gold-dark font-medium inline-block"
                                  whileHover={{ x: 4 }}
                                >
                                  View Details →
                                </motion.span>
                              </div>
                            </Tilt3D>
                          </NavLink>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Computer courses */}
              {activeCategory === "computer-courses" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-slate col-span-full text-center"
                    >
                      No courses have been added yet.
                    </motion.p>
                  ) : (
                    courses.map((course) => {
                      const Icon = ICONS[course.icon];
                      const topics = course.topics || [];
                      const previewTopics = topics.slice(0, 3);

                      return (
                        <motion.div key={course.slug} variants={cardItem}>
                          <Tilt3D
                            onClick={() => setSelectedCourse(course)}
                            className="cursor-pointer bg-white border border-ink/10 rounded-2xl p-6 flex flex-col h-full hover:border-gold hover:shadow-md transition-colors duration-300"
                          >
                            <motion.div
                              whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.12 }}
                              transition={{ duration: 0.5 }}
                              className="w-12 h-12 mb-4 rounded-full bg-parchment flex items-center justify-center"
                            >
                              {Icon && <Icon className="text-gold-dark" size={22} />}
                            </motion.div>

                            <h3 className="font-display text-lg font-semibold text-ink mb-2">
                              {course.title}
                            </h3>
                            <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">
                              {course.description}
                            </p>

                            <ul className="space-y-1.5 mb-4">
                              {previewTopics.map((topic, i) => (
                                <motion.li
                                  key={topic}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.05 }}
                                  className="text-charcoal text-xs flex items-start gap-2"
                                >
                                  <span className="text-gold-dark">•</span> {topic}
                                </motion.li>
                              ))}
                            </ul>

                            <div className="mt-auto flex items-center justify-between text-xs text-slate">
                              <span>Duration: {course.duration}</span>
                              <motion.span
                                whileHover={{ x: 3 }}
                                className="text-gold-dark font-medium hover:underline"
                              >
                                View Details →
                              </motion.span>
                            </div>
                          </Tilt3D>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </main>
  );
};

export default Academics;