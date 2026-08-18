import * as FaIcons from 'react-icons/fa';
import { motion } from 'framer-motion';
import Tilt3D from '../common/Tilt3D';
import AnimatedText from '../common/AnimatedText';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CoreValues = ({ values }) => {
  if (!values || values.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <AnimatedText
        as="h2"
        className="font-display text-3xl text-ink text-center mb-10"
      >
        Our Core Values
      </AnimatedText>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {values.map((v, i) => {
          const Icon = FaIcons[v.icon] || FaIcons.FaStar;
          return (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <Tilt3D className="bg-white rounded-xl border border-ink/10 p-6 text-center h-full">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-3"
                >
                  <Icon className="text-gold text-3xl mx-auto" />
                </motion.div>
                <h3 className="font-body font-semibold text-ink mb-2">{v.title}</h3>
                <p className="font-body text-slate text-sm">{v.description}</p>
              </Tilt3D>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CoreValues;