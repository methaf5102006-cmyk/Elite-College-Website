import { useEffect, useState, useRef } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable auto-advancing image carousel / lightbox modal.
 * Pass an array of image URLs — works for Facilities, Events, Gallery, etc.
 *
 * Props:
 *  - images: string[]   (required)
 *  - title: string      (optional heading shown below the image)
 *  - description: string (optional text shown below the image)
 *  - onClose: () => void (required)
 *  - interval: number   (ms between auto slides, default 3000)
 *  - initialIndex: number (which image to open on, default 0)
 */
const ImageCarouselModal = ({ images = [], title, description, onClose, interval = 3000, initialIndex = 0 }) => {
  const [current, setCurrent] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const slides = Array.isArray(images) ? images.filter(Boolean) : [];

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [slides.length, isPaused, interval]);

  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative bg-ink">
          <img
            key={current}
            src={slides[current]}
            alt={`${title || 'Image'} ${current + 1}`}
            className="w-full max-h-[60vh] object-cover"
          />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
          >
            <FiX size={20} />
          </button>

          {slides.length > 1 && (
            <>
              {/* Prev / Next arrows (manual override) */}
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition"
              >
                <FiChevronRight size={22} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {(title || description) && (
          <div className="p-6">
            {title && <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>}
            {description && (
              <p className="font-body text-slate text-sm leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarouselModal;