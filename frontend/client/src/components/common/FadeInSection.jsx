import { motion } from "framer-motion";
import { fadeInUp } from "../../utils/motionVariants";

/**
 * Har page/section mein ise wrap kar dein — scroll pe animate ho jayega
 * Usage: <FadeInSection><YourContent /></FadeInSection>
 */
export default function FadeInSection({ children, variant = fadeInUp, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}