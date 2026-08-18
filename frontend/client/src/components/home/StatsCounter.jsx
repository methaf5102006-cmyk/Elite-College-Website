import { useState, useEffect, useRef } from "react";
import { getNotices } from "../../services/noticeService";
import { getEvents } from "../../services/eventService";

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (value === null) return;

    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <>{value === null ? "—" : display}</>;
};

const StatsCounter = () => {
  const [noticeCount, setNoticeCount] = useState(null);
  const [upcomingEventCount, setUpcomingEventCount] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const notices = await getNotices();
        setNoticeCount(notices.length);
      } catch (err) {
        console.error("Failed to load notice count:", err);
      }

      try {
        const events = await getEvents({ filter: "upcoming" });
        setUpcomingEventCount(events.length);
      } catch (err) {
        console.error("Failed to load event count:", err);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { label: "Active Notices", value: noticeCount },
    { label: "Upcoming Events", value: upcomingEventCount },
  ];

  return (
    <section className="bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-6 sm:gap-10 max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl sm:text-5xl text-gold mb-2">
                <AnimatedNumber value={stat.value} />
              </p>
              <p className="text-parchment/60 text-sm tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;