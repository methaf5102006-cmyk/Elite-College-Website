import { motion } from 'framer-motion';

const PARTICLE_COUNT = 22;

const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  left: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 14 + Math.random() * 12,
  delay: Math.random() * 14,
  drift: Math.random() * 60 - 30,
}));

const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-parchment dark:bg-charcoal transition-colors duration-300"
    >
      {/* ---------- Layer 1: dot grid ---------- */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-[0.35]"
        animate={{ x: [0, 14, 0], y: [0, 24, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <pattern id="bg-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" className="fill-ink/25 dark:fill-parchment/20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-dot-grid)" />
      </motion.svg>

      {/* ---------- Layer 2: glow orbs ---------- */}
      <motion.div
        className="absolute -top-24 left-[8%] w-80 h-80 rounded-full bg-gold/20 dark:bg-gold/15 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-ink/10 dark:bg-parchment/10 blur-3xl"
        animate={{
          x: [0, -35, 0],
          y: [0, 25, 0],
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-gold/15 dark:bg-gold/10 blur-3xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -25, 0],
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ---------- Layer 3: floating particles ---------- */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/50"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ['0vh', '-110vh'],
            x: [0, p.drift],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;