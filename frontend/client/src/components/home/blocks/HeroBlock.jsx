import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const HeroBlock = ({ content = {} }) => {
  const {
    eyebrow = "",
    heading = "",
    description = "",
    images = [],
    buttons = [],
  } = content;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="font-body text-sm sm:text-base tracking-[0.25em] uppercase text-gold font-bold mb-5">
              {eyebrow}
            </p>
          )}

          {heading && (
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-parchment leading-[1.1] mb-6">
              {heading}
            </h1>
          )}

          {description && (
            <p className="text-parchment/80 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {buttons.map((btn, i) => (
                <NavLink
                  key={i}
                  to={btn.link || "#"}
                  className={
                    i === 0
                      ? "inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-gold text-ink text-sm font-semibold tracking-wide hover:bg-gold-dark transition-colors duration-200"
                      : "inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-parchment/50 text-parchment text-sm font-medium tracking-wide hover:bg-parchment/10 transition-colors duration-200"
                  }
                >
                  {btn.label}
                </NavLink>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="flex gap-2 mt-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-gold' : 'w-1.5 bg-parchment/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;