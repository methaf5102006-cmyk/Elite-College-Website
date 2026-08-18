import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFaculty, getDepartmentsForFilter } from '../services/facultyService';
import Loader from '../components/common/Loader';
import FacultyCard from '../components/faculty/FacultyCard';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const filterContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const filterButtonVariant = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const [facultyData, deptData] = await Promise.all([
          getFaculty(),
          getDepartmentsForFilter()
        ]);
        setFaculty(facultyData);
        setDepartments(deptData);
      } catch (err) {
        setError('Failed to load faculty data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleFilterChange = async (deptId) => {
    setSelectedDept(deptId);
    try {
      setLoading(true);
      const data = await getFaculty(deptId);
      setFaculty(data);
    } catch (err) {
      setError('Failed to load faculty data.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <p className="text-slate font-body">{error}</p>
      </motion.div>
    );
  }

  return (
    <main className="bg-parchment min-h-screen">
      <motion.section
        initial="hidden"
        animate="visible"
        className="bg-ink text-parchment py-16 px-6 text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.h1
          custom={0}
          variants={fadeUp}
          className="font-display text-4xl md:text-5xl mb-3 relative z-10"
        >
          Our Faculty
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          Meet the dedicated educators shaping our students' futures.
        </motion.p>
      </motion.section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {departments.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={filterContainer}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            <motion.button
              variants={filterButtonVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange('')}
              className={`font-body text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
                selectedDept === ''
                  ? 'bg-ink text-parchment border-ink'
                  : 'bg-white text-ink border-ink/20 hover:border-ink'
              }`}
            >
              All
            </motion.button>
            {departments.map((dept) => (
              <motion.button
                key={dept._id}
                variants={filterButtonVariant}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(dept._id)}
                className={`font-body text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
                  selectedDept === dept._id
                    ? 'bg-ink text-parchment border-ink'
                    : 'bg-white text-ink border-ink/20 hover:border-ink'
                }`}
              >
                {dept.name}
              </motion.button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader />
            </motion.div>
          ) : faculty.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="font-body text-slate text-center"
            >
              No faculty members have been added to this category yet.
            </motion.p>
          ) : (
            <motion.div
              key={selectedDept || 'all'}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={gridContainer}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {faculty.map((member) => (
                <motion.div
                  key={member._id}
                  variants={cardVariant}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <FacultyCard member={member} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Faculty;