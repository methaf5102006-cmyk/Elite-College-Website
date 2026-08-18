import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAbout } from '../services/aboutService';
import Loader from '../components/common/Loader';
import MissionVision from '../components/about/MissionVision';
import Timeline from '../components/about/Timeline';
import LeadershipMessage from '../components/about/LeadershipMessage';
import CoreValues from '../components/about/CoreValues';
import AnimatedText from '../components/common/AnimatedText';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const data = await getAbout();
        setAbout(data);
      } catch (err) {
        setError('About page ka content load nahi ho saka. Baad mein try karein.');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate font-body">{error}</p>
      </div>
    );
  }

  const hasContent =
    about &&
    (about.intro?.description ||
      about.mission ||
      about.vision ||
      about.history?.milestones?.length ||
      about.leadershipMessage?.message ||
      about.coreValues?.length);

  return (
    <main className="bg-parchment overflow-hidden">
      <section className="relative bg-ink text-parchment py-20 px-6 text-center overflow-hidden">
        {/* Ambient blobs for depth */}
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-gold-dark/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <AnimatedText
          as="h1"
          className="font-display text-4xl md:text-5xl mb-3 relative z-10"
        >
          {about?.intro?.heading || 'About EliteCollege'}
        </AnimatedText>

        {about?.intro?.description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
          >
            {about.intro.description}
          </motion.p>
        )}
      </section>

      {!hasContent ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <p className="font-body text-slate">
            About page ka content abhi admin ne add nahi kiya. Jald hi yahan college ki tafseel milegi.
          </p>
        </motion.div>
      ) : (
        <>
          <MissionVision mission={about.mission} vision={about.vision} />
          <Timeline
            heading={about.history?.heading}
            description={about.history?.description}
            milestones={about.history?.milestones || []}
          />
          <LeadershipMessage leadership={about.leadershipMessage} />
          <CoreValues values={about.coreValues || []} />
        </>
      )}
    </main>
  );
};

export default About;