import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getEvents } from '../services/eventService';
import { getNotices } from '../services/noticeService';
import { getAllNews } from '../services/newsService';
import Loader from '../components/common/Loader';
import EventCard from '../components/news-events/EventCard';
import NoticeCard from '../components/news-events/NoticeCard';
import ImageCarouselModal from '../components/common/ImageCarouselModal';

const tabs = [
  { id: 'news', label: 'News' },
  { id: 'events', label: 'Events' },
  { id: 'notices', label: 'Notices' },
];

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

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [eventFilter, setEventFilter] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        if (activeTab === 'events') {
          const data = await getEvents(eventFilter);
          setEvents(data);
        } else if (activeTab === 'notices') {
          const data = await getNotices();
          setNotices(data);
        } else {
          const data = await getAllNews();
          setNewsItems(data);
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, eventFilter]);

  // Backward-compatible: supports event.images (array, new) or event.image (string, old)
  const getEventImages = (event) => {
    if (Array.isArray(event?.images) && event.images.length > 0) return event.images;
    if (event?.image) return [event.image];
    return [];
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
          News & Events
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          Stay updated with the latest happenings at our institute.
        </motion.p>
      </motion.section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={filterContainer}
          className="flex justify-center gap-2 mb-8 flex-wrap"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              variants={filterButtonVariant}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`font-body text-sm px-5 py-2 rounded-full border transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-ink text-parchment border-ink'
                  : 'bg-white text-ink border-ink/20 hover:border-ink'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'events' && (
            <motion.div
              key="event-filters"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center gap-2 mb-10"
            >
              <button
                onClick={() => setEventFilter('upcoming')}
                className={`font-body text-xs px-4 py-1.5 rounded-full border transition ${
                  eventFilter === 'upcoming' ? 'bg-gold text-white border-gold' : 'bg-white text-slate border-ink/20'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setEventFilter('past')}
                className={`font-body text-xs px-4 py-1.5 rounded-full border transition ${
                  eventFilter === 'past' ? 'bg-gold text-white border-gold' : 'bg-white text-slate border-ink/20'
                }`}
              >
                Past
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
              key={`${activeTab}-${eventFilter}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'news' ? (
                newsItems.length === 0 ? (
                  <p className="font-body text-slate text-center">No news has been added yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {newsItems.map((item, i) => (
                      <motion.div
                        key={item.slug}
                        custom={i}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          to={`/news/${item.slug}`}
                          className="block bg-white rounded-lg overflow-hidden border border-ink/10 hover:shadow-md transition"
                        >
                          <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <span className="text-xs text-gold font-body">{item.category}</span>
                            <h3 className="font-display text-lg text-ink mt-1 mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-xs text-slate font-body">
                              {new Date(item.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : activeTab === 'events' ? (
                events.length === 0 ? (
                  <p className="font-body text-slate text-center">No events found in this category.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {events.map((event, i) => (
                      <motion.div key={event._id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                        <EventCard event={event} onImageClick={setSelectedEvent} />
                      </motion.div>
                    ))}
                  </div>
                )
              ) : notices.length === 0 ? (
                <p className="font-body text-slate text-center">No notices have been added yet.</p>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice, i) => (
                    <motion.div key={notice._id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <NoticeCard notice={notice} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------- Multi-image auto-advancing carousel modal ---------- */}
      {selectedEvent && (
        <ImageCarouselModal
          images={getEventImages(selectedEvent)}
          title={selectedEvent.title}
          description={selectedEvent.description}
          onClose={() => setSelectedEvent(null)}
          interval={3000}
        />
      )}
    </main>
  );
};

export default NewsEvents;