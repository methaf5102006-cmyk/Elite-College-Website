import { motion } from 'framer-motion';
import Tilt3D from '../common/Tilt3D';
import AnimatedText from '../common/AnimatedText';

const LeadershipMessage = ({ leadership }) => {
  if (!leadership || !leadership.message) return null;

  return (
    <section className="bg-ink text-parchment py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <Tilt3D className="flex flex-col md:flex-row items-center gap-8 rounded-xl p-6">
          {leadership.image && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              src={leadership.image}
              alt={leadership.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gold"
            />
          )}
          <div>
            <AnimatedText
              as="p"
              className="font-body italic text-lg leading-relaxed mb-4"
              stagger={0.02}
            >
              {`"${leadership.message}"`}
            </AnimatedText>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-display text-gold text-lg"
            >
              {leadership.name}
            </motion.p>
            {leadership.designation && (
              <p className="font-body text-parchment/70 text-sm">
                {leadership.designation}
              </p>
            )}
          </div>
        </Tilt3D>
      </div>
    </section>
  );
};

export default LeadershipMessage;