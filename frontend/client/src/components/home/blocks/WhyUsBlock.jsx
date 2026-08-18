import { FiCheckCircle } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Tilt3D from "../../common/Tilt3D";
import AnimatedText from "../../common/AnimatedText";

const WhyUsBlock = ({ content = {} }) => {
  const { eyebrow = "", heading = "", reasons = [], image = "" } = content;
  const listRef = useRef(null);
  const isListInView = useInView(listRef, { once: true, amount: 0.3 });

  const listContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const listItem = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div style={{ perspective: 1000 }}>
            {eyebrow && (
              <AnimatedText
                as="p"
                className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase text-gold-dark mb-3"
              >
                {eyebrow}
              </AnimatedText>
            )}
            {heading && (
              <AnimatedText
                as="h2"
                className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-8"
                delay={0.1}
              >
                {heading}
              </AnimatedText>
            )}

            {reasons.length > 0 && (
              <motion.ul
                ref={listRef}
                className="space-y-4"
                initial="hidden"
                animate={isListInView ? "visible" : "hidden"}
                variants={listContainer}
              >
                {reasons.map((reason, i) => (
                  <motion.li
                    key={i}
                    variants={listItem}
                    className="flex items-start gap-3"
                  >
                    <FiCheckCircle className="text-gold-dark shrink-0 mt-0.5" size={20} />
                    <span className="text-base text-charcoal">{reason}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          {image && (
            <div className="relative" style={{ perspective: 800 }}>
              <div className="absolute -inset-3 border-2 border-gold/30 rounded-2xl -z-10" />
              <Tilt3D className="rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt={heading}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </Tilt3D>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhyUsBlock;