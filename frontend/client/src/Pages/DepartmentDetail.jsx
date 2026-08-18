import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiFlag,
  FiTarget,
} from "react-icons/fi";
import { getDepartmentBySlug } from "../services/departmentService";
import AnimatedText from "../components/common/AnimatedText";

const TABS = ["Introduction", "Careers Path", "Courses List", "Fee Structure"];

// ---------- shared variants ----------
const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ==================================================
// Diagram: Specialization Tracks (org-chart / branching)
// ==================================================
const TrackDiagram = ({ tracks, note, shortName }) => {
  const n = tracks.length;
  const showFullDiagram = n >= 2 && n <= 5;
  const leftPct = 50 / n;
  const widthPct = 100 - 100 / n;

  return (
    <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 sm:p-8 overflow-hidden">
      <h2 className="font-display text-xl text-ink font-semibold mb-3 flex items-center gap-2">
        <FiTarget className="text-gold-dark" /> Specialization Tracks
      </h2>
      {note && (
        <p className="text-charcoal text-sm sm:text-base mb-8 max-w-2xl">
          {note}
        </p>
      )}

      {showFullDiagram ? (
        <div className="hidden sm:block mb-8">
          {/* Hub node */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="px-5 py-2.5 rounded-full bg-ink text-parchment text-sm font-medium shadow-sm z-10"
            >
              Choose Your Track {shortName ? `(${shortName})` : ""}
            </motion.div>
            {/* vertical stem from hub */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 28 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="w-px bg-gold-dark/50"
            />
          </div>

          {/* horizontal connector */}
          <div className="relative h-7">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              className="absolute top-0 h-px bg-gold-dark/50 origin-left"
            />
            {tracks.map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: 28 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.65 + i * 0.08 }}
                style={{ left: `${((i + 0.5) * 100) / n}%` }}
                className="absolute top-0 w-px bg-gold-dark/50 -translate-x-1/2"
              />
            ))}
          </div>

          {/* track nodes */}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {tracks.map((track, i) => (
              <motion.div
                key={track}
                initial={{ opacity: 0, y: -14, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="mx-1.5 bg-white border border-ink/10 rounded-xl px-3 py-3 text-center hover:border-gold hover:shadow-sm transition-colors duration-200"
              >
                <span className="text-charcoal text-xs sm:text-sm font-medium">
                  {track}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {/* fallback / mobile: simple list (also shown under diagram on mobile) */}
      <div className={`grid sm:grid-cols-2 gap-2.5 ${showFullDiagram ? "sm:hidden" : ""}`}>
        {tracks.map((track, i) => (
          <motion.div
            key={track}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={listItem}
            className="flex items-start gap-3"
          >
            <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={18} />
            <span className="text-charcoal text-sm sm:text-base">{track}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==================================================
// Diagram: Careers Roadmap (horizontal connected path)
// ==================================================
const CareerRoadmap = ({ careers }) => (
  <div className="bg-white border border-ink/10 rounded-2xl p-6 sm:p-8 overflow-x-auto">
    <div className="flex items-center min-w-max gap-0 pb-2">
      {careers.map((career, i) => (
        <div key={career} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center w-36"
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-4 h-4 rounded-full bg-gold-dark relative"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-gold-dark"
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
            <span className="mt-3 text-xs sm:text-sm text-charcoal text-center leading-snug px-1">
              {career}
            </span>
          </motion.div>

          {i < careers.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 + 0.15 }}
              className="w-10 sm:w-14 h-px bg-gold-dark/40 origin-left -mt-6"
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

// ==================================================
// Diagram: Further Pathways (vertical timeline)
// ==================================================
const PathwayTimeline = ({ items }) => (
  <div className="relative pl-8">
    <motion.div
      initial={{ height: 0 }}
      whileInView={{ height: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute left-[7px] top-2 w-px bg-gold-dark/30"
    />
    <div className="space-y-5">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.15, duration: 0.25 }}
            className="absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full bg-gold-dark border-2 border-parchment"
          />
          <div className="flex items-start gap-3 bg-white border border-ink/10 rounded-xl px-4 py-3 hover:border-gold transition-colors duration-200">
            <FiFlag className="text-gold-dark shrink-0 mt-0.5" size={16} />
            <span className="text-charcoal text-sm sm:text-base">{item}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const DepartmentDetail = () => {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("Introduction");

  useEffect(() => {
    const fetchDept = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const data = await getDepartmentBySlug(slug);
        setDept(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDept();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="h-8 w-64 bg-white/60 rounded-lg mb-4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-ink/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !dept) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4 py-24 text-center"
      >
        <h1 className="font-display text-2xl text-ink mb-4">
          Department not found
        </h1>
        <Link to="/academics" className="text-gold-dark underline">
          Back to Academics
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-parchment">
      {/* ---------- Header ---------- */}
      <div className="relative bg-ink text-parchment py-14 sm:py-20 overflow-hidden">
        <motion.div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gold/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-gold-dark/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/academics"
              className="inline-flex items-center gap-2 text-sm text-parchment/70 hover:text-gold mb-6 transition-colors"
            >
              <FiArrowLeft size={16} /> Back to Academics
            </Link>
          </motion.div>

          <AnimatedText as="h1" className="font-display text-3xl sm:text-4xl font-semibold mb-4">
            {dept.name}
          </AnimatedText>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-parchment/80 text-base leading-relaxed max-w-3xl"
          >
            {dept.tagline}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={listContainer}
            className="mt-6 flex flex-wrap gap-6 text-sm text-parchment/70"
          >
            <motion.span variants={listItem}>
              <strong className="text-gold">Duration:</strong> {dept.duration}
            </motion.span>
            {dept.affiliation && (
              <motion.span variants={listItem}>
                <strong className="text-gold">Affiliation:</strong> {dept.affiliation}
              </motion.span>
            )}
            {dept.meritCriteria && (
              <motion.span variants={listItem}>
                <strong className="text-gold">Merit Criteria:</strong> {dept.meritCriteria}
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ---------- Tabs ---------- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-ink/10 p-2 flex flex-wrap gap-2 mb-10 relative"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                activeTab === tab ? "text-parchment" : "text-slate hover:text-ink"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="deptTabPill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 bg-ink rounded-xl -z-0"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </motion.div>

        <div className="pb-16 sm:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Introduction tab */}
              {activeTab === "Introduction" && (
                <div className="space-y-10">
                  {dept.specializationTracks?.length > 0 && (
                    <TrackDiagram
                      tracks={dept.specializationTracks}
                      note={dept.specializationNote}
                      shortName={dept.shortName}
                    />
                  )}

                  {dept.objectives?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        🎓 Program Objectives
                      </h2>
                      <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={listContainer}
                        className="space-y-2.5"
                      >
                        {dept.objectives.map((item) => (
                          <motion.li key={item} variants={listItem} className="flex items-start gap-3">
                            <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={18} />
                            <span className="text-charcoal text-sm sm:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  )}

                  {dept.coreAreas?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        📘 Core Areas of Study
                      </h2>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={listContainer}
                        className="grid sm:grid-cols-2 gap-2.5"
                      >
                        {dept.coreAreas.map((item) => (
                          <motion.div key={item} variants={listItem} className="flex items-start gap-3">
                            <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={18} />
                            <span className="text-charcoal text-sm sm:text-base">{item}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {dept.whyChoose?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        🎯 Why Choose {dept.shortName}?
                      </h2>
                      <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={listContainer}
                        className="space-y-2.5"
                      >
                        {dept.whyChoose.map((item) => (
                          <motion.li key={item} variants={listItem} className="flex items-start gap-3">
                            <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={18} />
                            <span className="text-charcoal text-sm sm:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  )}

                  {dept.eligibility?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        🎯 Eligibility Criteria
                      </h2>
                      <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={listContainer}
                        className="space-y-2.5"
                      >
                        {dept.eligibility.map((item) => (
                          <motion.li key={item} variants={listItem} className="flex items-start gap-3">
                            <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={18} />
                            <span className="text-charcoal text-sm sm:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  )}
                </div>
              )}

              {/* Careers Path tab */}
              {activeTab === "Careers Path" && (
                <div className="space-y-10">
                  {dept.careers?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        📈 Career Opportunities
                      </h2>
                      <CareerRoadmap careers={dept.careers} />
                    </div>
                  )}

                  {dept.furtherPathways?.length > 0 && (
                    <div>
                      <h2 className="font-display text-xl text-ink font-semibold mb-4">
                        📚 Further Academic Pathways
                      </h2>
                      <PathwayTimeline items={dept.furtherPathways} />
                    </div>
                  )}
                </div>
              )}

              {/* Courses List tab */}
              {activeTab === "Courses List" && (
                <div>
                  <h2 className="font-display text-xl text-ink font-semibold mb-4">
                    📖 Courses Included
                  </h2>
                  {dept.courses?.length > 0 ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={listContainer}
                      className="grid sm:grid-cols-2 gap-2.5"
                    >
                      {dept.courses.map((course, i) => (
                        <motion.div
                          key={course}
                          variants={listItem}
                          whileHover={{ x: 3, borderColor: "rgba(197,160,90,0.6)" }}
                          className="flex items-center gap-3 bg-white border border-ink/10 rounded-lg px-4 py-3 transition-colors"
                        >
                          <span className="text-gold-dark font-semibold text-sm">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-charcoal text-sm sm:text-base">{course}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-slate text-sm">Courses will be updated soon.</p>
                  )}
                </div>
              )}

              {/* Fee Structure tab */}
              {activeTab === "Fee Structure" && (
                <div>
                  <h2 className="font-display text-xl text-ink font-semibold mb-4">
                    💳 Fee Structure
                  </h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-ink/10 rounded-2xl p-8 text-center"
                  >
                    <p className="text-charcoal text-sm sm:text-base mb-2">
                      Detailed fee structure for {dept.name} will be updated here.
                    </p>
                    <p className="text-slate text-sm">
                      Please contact the admissions office for the latest fee
                      details and available scholarship options.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block mt-6">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-ink text-parchment text-sm font-medium rounded-md hover:bg-ink-light transition-colors"
                      >
                        Contact Admissions <FiArrowRight size={14} />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;