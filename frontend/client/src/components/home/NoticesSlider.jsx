import { useState, useEffect } from "react";
import { FiBell, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getNotices } from "../../services/noticeService";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const NoticesSlider = () => {
  const [notices, setNotices] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setStatus("loading");
        const data = await getNotices(8); // latest 8 active notices
        setNotices(data);
        setStatus("success");
      } catch (err) {
        console.error("Failed to load notices:", err);
        setStatus("error");
      }
    };

    fetchNotices();
  }, []);

  const goPrev = () => setActiveIndex((i) => (i === 0 ? notices.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === notices.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-parchment border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-dark mb-2">
              Stay Updated
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">Notices</h2>
          </div>

          {status === "success" && notices.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous notice"
                className="p-2.5 border border-ink/15 text-ink hover:bg-ink hover:text-parchment transition-colors duration-200"
              >
                <FiArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next notice"
                className="p-2.5 border border-ink/15 text-ink hover:bg-ink hover:text-parchment transition-colors duration-200"
              >
                <FiArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {status === "loading" && (
          <div className="animate-pulse bg-white border border-ink/10 p-8">
            <div className="h-4 bg-ink/10 w-1/4 mb-4" />
            <div className="h-6 bg-ink/10 w-2/3 mb-3" />
            <div className="h-4 bg-ink/10 w-full" />
          </div>
        )}

        {status === "error" && (
          <div className="bg-white border border-ink/10 p-8 text-center">
            <p className="text-slate text-sm">
              Couldn't load notices right now. Please try again shortly.
            </p>
          </div>
        )}

        {status === "success" && notices.length === 0 && (
          <div className="bg-white border border-ink/10 p-10 text-center">
            <FiBell className="mx-auto text-ink/20 mb-3" size={28} />
            <p className="text-slate text-sm">No notices available at the moment.</p>
          </div>
        )}

        {status === "success" && notices.length > 0 && (
          <div className="bg-white border border-ink/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full bg-ink/5 flex items-center justify-center">
                <FiBell className="text-gold-dark" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate mb-1.5">{formatDate(notices[activeIndex].date)}</p>
                <h3 className="font-display text-lg sm:text-xl text-ink mb-2">
                  {notices[activeIndex].title}
                </h3>
                <p className="text-sm text-slate leading-relaxed line-clamp-3">
                  {notices[activeIndex].description}
                </p>
              </div>
            </div>

            {notices.length > 1 && (
              <div className="flex items-center gap-1.5 mt-6">
                {notices.map((n, idx) => (
                  <button
                    key={n._id}
                    type="button"
                    aria-label={`Go to notice ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 transition-all duration-200 ${
                      idx === activeIndex ? "w-6 bg-gold" : "w-1.5 bg-ink/15"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticesSlider;