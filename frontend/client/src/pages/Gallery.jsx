import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryImages } from '../services/galleryService';
import Loader from '../components/common/Loader';
import GalleryGrid from '../components/gallery/GalleryGrid';

const categories = ['All', 'Campus', 'Events', 'Sports', 'Convocation', 'Labs', 'Other'];

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

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getGalleryImages(activeCategory === 'All' ? '' : activeCategory);
        setImages(data);
      } catch (err) {
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [activeCategory]);

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
          Gallery
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          A glimpse into campus life, events, and achievements.
        </motion.p>
      </motion.section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={filterContainer}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={filterButtonVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
                activeCategory === cat
                  ? 'bg-ink text-parchment border-ink'
                  : 'bg-white text-ink border-ink/20 hover:border-ink'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

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
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <GalleryGrid images={images} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Gallery;