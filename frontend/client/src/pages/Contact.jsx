import { motion } from 'framer-motion';
import ContactForm from '../components/contact/ContactForm';
import MapEmbed from '../components/contact/MapEmbed';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Contact = () => {
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
          Contact Us
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          Have a question? We'd love to hear from you.
        </motion.p>
      </motion.section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ContactForm />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MapEmbed />
        </motion.div>
      </section>
    </main>
  );
};

export default Contact;