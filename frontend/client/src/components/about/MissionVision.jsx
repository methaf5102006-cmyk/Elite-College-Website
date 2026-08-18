import Tilt3D from '../common/Tilt3D';
import AnimatedText from '../common/AnimatedText';

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MissionVision = ({ mission, vision }) => {
  if (!mission && !vision) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
      {mission && (
        <Tilt3D
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          className="bg-white rounded-xl border border-ink/10 p-8 h-full"
        >
          <AnimatedText as="h2" className="font-display text-2xl text-ink mb-3">
            Our Mission
          </AnimatedText>
          <p className="font-body text-charcoal leading-relaxed">{mission}</p>
        </Tilt3D>
      )}
      {vision && (
        <Tilt3D
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          className="bg-white rounded-xl border border-gold/20 p-8 h-full"
        >
          <AnimatedText as="h2" className="font-display text-2xl text-ink mb-3">
            Our Vision
          </AnimatedText>
          <p className="font-body text-charcoal leading-relaxed">{vision}</p>
        </Tilt3D>
      )}
    </section>
  );
};

export default MissionVision;