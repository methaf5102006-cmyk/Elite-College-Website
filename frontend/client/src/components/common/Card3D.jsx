import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { NavLink } from "react-router-dom";

const Card3D = ({ to, children, className = "" }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring smoothing — no jitter
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  const lift = useSpring(hovered ? -8 : 0, springConfig); // clean up movement only

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
    <NavLink to={to} className="block" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          y: lift,
          transformStyle: "preserve-3d",
          boxShadow: hovered
            ? "0 25px 40px -10px rgba(15, 15, 15, 0.45), 0 10px 15px -5px rgba(15,15,15,0.3)"
            : "0 4px 10px -4px rgba(15, 15, 15, 0.15)",
          transition: "box-shadow 0.3s ease",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </NavLink>
  );
};

export default Card3D;