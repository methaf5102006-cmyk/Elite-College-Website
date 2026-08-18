import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiClock, FiBookOpen, FiCheckCircle, FiFlag } from "react-icons/fi";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panel = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 24,
    scale: 0.97,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

// Curriculum roadmap — vertical timeline of topics
const TopicsRoadmap = ({ topics }) => (
  <div className="relative pl-8 mt-3">
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "100%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute left-[7px] top-2 w-px bg-gold-dark/30"
    />
    <motion.div initial="hidden" animate="visible" variants={listContainer} className="space-y-3">
      {topics.map((topic, i) => (
        <motion.div
          key={topic}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.06 + 0.12, duration: 0.25 }}
            className="absolute -left-[26px] top-2.5 w-3.5 h-3.5 rounded-full bg-gold-dark border-2 border-parchment"
          />
          <div className="flex items-center gap-2.5 bg-white border border-ink/10 rounded-lg px-4 py-2.5 hover:border-gold transition-colors duration-200">
            <span className="text-gold-dark font-semibold text-xs shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-charcoal text-sm">{topic}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const CourseModal = ({ course, onClose }) => {
  if (!course) return null;
  const topics = course.topics || [];

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          key="backdrop"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdrop}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            key="panel"
            variants={panel}
            onClick={(e) => e.stopPropagation()}
            className="bg-parchment rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-ink text-parchment px-6 py-6 overflow-hidden shrink-0">
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/20 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-20 cursor-pointer"
              >
                <FiX size={16} />
              </motion.button>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="font-display text-2xl font-semibold pr-10 relative z-10"
              >
                {course.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.35 }}
                className="mt-3 flex flex-wrap gap-4 text-sm text-parchment/80 relative z-10"
              >
                <span className="flex items-center gap-1.5">
                  <FiClock size={14} className="text-gold" /> {course.duration}
                </span>
                {course.eligibility && (
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle size={14} className="text-gold" /> {course.eligibility}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 overflow-y-auto">
              {course.description && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-charcoal text-sm sm:text-base leading-relaxed mb-6"
                >
                  {course.description}
                </motion.p>
              )}

              {topics.length > 0 && (
                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="font-display text-base font-semibold text-ink flex items-center gap-2 mb-1"
                  >
                    <FiBookOpen className="text-gold-dark" size={16} /> Curriculum Roadmap
                  </motion.h3>
                  <TopicsRoadmap topics={topics} />
                </div>
              )}

              {course.outcomes?.length > 0 && (
                <div className="mt-7">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="font-display text-base font-semibold text-ink flex items-center gap-2 mb-3"
                  >
                    <FiFlag className="text-gold-dark" size={16} /> What You'll Achieve
                  </motion.h3>
                  <motion.div initial="hidden" animate="visible" variants={listContainer} className="space-y-2">
                    {course.outcomes.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="flex items-start gap-2.5"
                      >
                        <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={16} />
                        <span className="text-charcoal text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourseModal;