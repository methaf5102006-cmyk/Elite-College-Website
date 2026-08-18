import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFacilities } from '../services/facilityService';
import Loader from '../components/common/Loader';
import FacilityCard from '../components/facilities/FacilityCard';
import ImageCarouselModal from '../components/common/ImageCarouselModal';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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
};

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const data = await getFacilities();
        setFacilities(data);
      } catch (err) {
        setError('Failed to load facilities data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  if (loading) return <Loader />;

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

  // Backward-compatible: supports facility.images (array, new) or facility.image (string, old)
  const getImages = (facility) => {
    if (Array.isArray(facility?.images) && facility.images.length > 0) return facility.images;
    if (facility?.image) return [facility.image];
    return [];
  };

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
          Our Facilities
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          Everything students need for a complete learning experience.
        </motion.p>
      </motion.section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {facilities.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-body text-slate text-center"
          >
            Facilities haven't been added by the admin yet. Details will be available here soon.
          </motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={gridContainer}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {facilities.map((facility) => (
              <motion.div
                key={facility._id}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              >
                <FacilityCard
                  facility={facility}
                  onImageClick={setSelectedFacility}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ---------- Multi-image auto-advancing carousel modal ---------- */}
      <AnimatePresence>
        {selectedFacility && (
          <ImageCarouselModal
            images={getImages(selectedFacility)}
            title={selectedFacility.title}
            description={selectedFacility.description}
            onClose={() => setSelectedFacility(null)}
            interval={3000}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Facilities;