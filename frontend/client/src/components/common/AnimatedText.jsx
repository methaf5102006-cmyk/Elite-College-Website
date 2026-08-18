import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Splits text into words and animates each in with a stagger, on scroll into view.
// Usage: <AnimatedText as="h2" className="...">Your heading text</AnimatedText>
const AnimatedText = ({
  children,
  as = "p",
  className = "",
  delay = 0,
  stagger = 0.04,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.4 });

  const text = typeof children === "string" ? children : String(children ?? "");
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: "0.6em", filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as] || motion.p;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={container}
      style={{ display: "block" }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          style={{ display: "inline-block", marginRight: "0.28em", willChange: "transform, filter" }}
        >
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;