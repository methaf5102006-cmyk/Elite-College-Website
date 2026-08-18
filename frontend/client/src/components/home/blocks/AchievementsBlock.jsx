import { FiAward } from "react-icons/fi";
import Tilt3D from "../../common/Tilt3D";
import AnimatedCounter from "../../common/AnimatedCounter";
import AnimatedText from "../../common/AnimatedText";

const AchievementsBlock = ({ content = {} }) => {
  const {
    eyebrow = "",
    heading = "",
    description = "",
    imageLeft = "",
    imageRight = "",
    highlight = null, // { title, subtitle }
    stats = [],
  } = content;

  return (
    <section className="bg-ink text-parchment py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr_1fr] gap-8 lg:gap-6 items-center">
          {imageLeft && (
            <div className="hidden lg:block" style={{ perspective: 800 }}>
              <Tilt3D className="rounded-2xl overflow-hidden border border-parchment/10">
                <img src={imageLeft} alt="" className="w-full h-72 object-cover" />
              </Tilt3D>
            </div>
          )}

          <div className="text-center" style={{ perspective: 1000 }}>
            {eyebrow && (
              <AnimatedText
                as="p"
                className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase text-gold mb-3"
              >
                {eyebrow}
              </AnimatedText>
            )}
            {heading && (
              <AnimatedText
                as="h2"
                className="font-display text-2xl sm:text-3xl font-semibold mb-5"
                delay={0.1}
              >
                {heading}
              </AnimatedText>
            )}
            {description && (
              <AnimatedText
                as="p"
                className="font-body text-parchment/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8"
                delay={0.2}
              >
                {description}
              </AnimatedText>
            )}

            {highlight?.title && (
              <div
                style={{ transform: "translateZ(35px)" }}
                className="max-w-md mx-auto mb-10 bg-parchment/5 border border-gold/30 rounded-2xl px-6 py-5 flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                  <FiAward className="text-gold" size={22} />
                </div>
                <div>
                  <AnimatedText
                    as="p"
                    className="font-display text-sm sm:text-base font-semibold text-parchment"
                  >
                    {highlight.title}
                  </AnimatedText>
                  {highlight.subtitle && (
                    <AnimatedText
                      as="p"
                      className="font-body text-xs sm:text-sm text-parchment/70 mt-1"
                      delay={0.1}
                    >
                      {highlight.subtitle}
                    </AnimatedText>
                  )}
                </div>
              </div>
            )}

            {(imageLeft || imageRight) && (
              <div className="grid grid-cols-2 gap-4 mb-10 lg:hidden">
                {imageLeft && (
                  <Tilt3D className="rounded-2xl overflow-hidden border border-parchment/10">
                    <img src={imageLeft} alt="" className="w-full h-36 sm:h-44 object-cover" />
                  </Tilt3D>
                )}
                {imageRight && (
                  <Tilt3D className="rounded-2xl overflow-hidden border border-parchment/10">
                    <img src={imageRight} alt="" className="w-full h-36 sm:h-44 object-cover" />
                  </Tilt3D>
                )}
              </div>
            )}

            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
                {stats.map((stat, i) => (
                  <div key={i} style={{ transform: "translateZ(20px)" }}>
                    <AnimatedCounter
                      value={stat.value}
                      className="font-display text-3xl sm:text-4xl font-bold text-gold block"
                    />
                    <AnimatedText
                      as="p"
                      className="font-body text-xs sm:text-sm text-parchment/70 mt-1 tracking-wide uppercase"
                      delay={0.15}
                    >
                      {stat.label}
                    </AnimatedText>
                  </div>
                ))}
              </div>
            )}
          </div>

          {imageRight && (
            <div className="hidden lg:block" style={{ perspective: 800 }}>
              <Tilt3D className="rounded-2xl overflow-hidden border border-parchment/10">
                <img src={imageRight} alt="" className="w-full h-72 object-cover" />
              </Tilt3D>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AchievementsBlock;