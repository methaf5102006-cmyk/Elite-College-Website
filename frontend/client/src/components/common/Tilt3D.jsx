import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Generic 3D tilt wrapper — now also accepts entrance-animation props
// (initial, whileInView, viewport, variants, custom, transition) so it can
// handle scroll-reveal AND mouse-tilt on the SAME element, no double-nesting.
const Tilt3D = ({ children, className = "", ...motionProps }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  const lift = useSpring(hovered ? -6 : 0, springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...motionProps} // initial / whileInView / variants / custom / transition
      style={{
        rotateX,
        rotateY,
        y: lift,
        transformStyle: "preserve-3d",
        perspective: 800,
        boxShadow: hovered
          ? "0 20px 35px -10px rgba(15, 15, 15, 0.4), 0 8px 12px -4px rgba(15,15,15,0.25)"
          : "0 2px 6px -2px rgba(15, 15, 15, 0.1)",
        transition: "box-shadow 0.3s ease",
        ...motionProps.style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Tilt3D;