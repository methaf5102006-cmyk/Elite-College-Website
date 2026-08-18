import * as FiIcons from "react-icons/fi";
import Tilt3D from "../../common/Tilt3D";
import AnimatedText from "../../common/AnimatedText";

const FeatureHighlightsBlock = ({ content = {} }) => {
  const { eyebrow = "", heading = "", items = [] } = content;

  if (items.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      {(eyebrow || heading) && (
        <div className="text-center mb-10">
          {eyebrow && (
            <AnimatedText
              as="p"
              className="font-body text-sm sm:text-base tracking-[0.25em] uppercase text-gold font-bold mb-3"
            >
              {eyebrow}
            </AnimatedText>
          )}
          {heading && (
            <AnimatedText
              as="h2"
              className="font-display text-3xl sm:text-4xl font-semibold text-ink"
            >
              {heading}
            </AnimatedText>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const Icon = FiIcons[item.icon] || FiIcons.FiStar;

          const RowContent = (
            <div className="group flex flex-col sm:flex-row items-center gap-5 sm:gap-6 bg-white hover:bg-parchment/40 transition-colors duration-300 p-5 sm:p-6 rounded-2xl border border-ink/10">
              <div
                style={{ transform: "translateZ(40px)" }}
                className="flex-shrink-0 w-full sm:w-40 h-40 sm:h-28 rounded-xl overflow-hidden bg-parchment flex items-center justify-center"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Icon className="text-gold-dark" size={30} />
                )}
              </div>

              <div
                style={{ transform: "translateZ(20px)" }}
                className="flex-1 text-center sm:text-left"
              >
                <AnimatedText
                  as="h3"
                  className="font-display text-lg font-semibold text-ink mb-1 group-hover:text-gold-dark transition-colors duration-300"
                >
                  {item.title}
                </AnimatedText>
                {item.description && (
                  <AnimatedText
                    as="p"
                    className="text-sm text-slate leading-relaxed"
                    delay={0.1}
                  >
                    {item.description}
                  </AnimatedText>
                )}
              </div>
            </div>
          );

          if (item.link) {
            return (
              <Tilt3D key={i} className="rounded-2xl overflow-hidden">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {RowContent}
                </a>
              </Tilt3D>
            );
          }

          return (
            <Tilt3D key={i} className="rounded-2xl overflow-hidden">
              {RowContent}
            </Tilt3D>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureHighlightsBlock;