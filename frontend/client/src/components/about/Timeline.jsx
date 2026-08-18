import { motion } from 'framer-motion';
import AnimatedText from '../common/AnimatedText';

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: 'backOut' } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Timeline = ({ heading, description, milestones }) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedText
          as="h2"
          className="font-display text-3xl text-ink text-center mb-2"
        >
          {heading || 'Our Journey'}
        </AnimatedText>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-slate text-center mb-10 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}

        <div className="relative pl-6 space-y-8">
          {/* Animated growing line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold/40"
          />

          {milestones.map((m, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={itemVariants}
              className="relative"
            >
              <motion.span
                variants={dotVariants}
                className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gold"
              />
              <span className="font-display text-gold-dark font-semibold">{m.year}</span>
              <h3 className="font-body font-semibold text-ink text-lg">{m.title}</h3>
              {m.description && (
                <p className="font-body text-slate mt-1">{m.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;