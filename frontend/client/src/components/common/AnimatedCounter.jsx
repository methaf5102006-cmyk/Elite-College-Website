import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Extracts the numeric part + keeps any prefix/suffix (like "+", "%", "K", "500+")
const parseValue = (raw) => {
  const str = String(raw).trim();
  const match = str.match(/-?\d[\d,]*\.?\d*/);
  if (!match) return { number: 0, prefix: "", suffix: str, hasCommas: false, decimals: 0 };

  const numberStr = match[0];
  const number = parseFloat(numberStr.replace(/,/g, ""));
  const prefix = str.slice(0, match.index);
  const suffix = str.slice(match.index + numberStr.length);
  const hasCommas = numberStr.includes(",");
  const decimalPart = numberStr.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;

  return { number, prefix, suffix, hasCommas, decimals };
};

const formatNumber = (num, hasCommas, decimals) => {
  const fixed = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
  if (!hasCommas) return fixed;

  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
};

const AnimatedCounter = ({ value, className = "", duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const { number, prefix, suffix, hasCommas, decimals } = parseValue(value);
  const [displayText, setDisplayText] = useState(
    `${prefix}${formatNumber(0, hasCommas, decimals)}${suffix}`
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, number, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayText(`${prefix}${formatNumber(latest, hasCommas, decimals)}${suffix}`);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, number]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
};

export default AnimatedCounter;