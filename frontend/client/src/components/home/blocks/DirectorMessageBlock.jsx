import Tilt3D from "../../common/Tilt3D";
import AnimatedText from "../../common/AnimatedText";

const DirectorMessageBlock = ({ content = {} }) => {
  const {
    eyebrow = "",
    message = "",
    image = "",
    name = "",
    designation = "",
    linkLabel = "",
    linkUrl = "",
  } = content;

  return (
    <section className="bg-parchment py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {image && (
            <div className="lg:col-span-4 flex justify-center" style={{ perspective: 800 }}>
              <Tilt3D className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full">
                <div className="absolute -inset-2 rounded-full border-2 border-gold/40" />
                <img
                  src={image}
                  alt={name}
                  className="relative w-full h-full object-cover rounded-full"
                />
              </Tilt3D>
            </div>
          )}

          <div
            className={`${image ? "lg:col-span-8" : "lg:col-span-12"} text-center lg:text-left`}
            style={{ perspective: 1000 }}
          >
            {eyebrow && (
              <AnimatedText
                as="p"
                className="font-body text-[11px] sm:text-xs tracking-[0.2em] uppercase text-gold-dark mb-3"
              >
                {eyebrow}
              </AnimatedText>
            )}

            {message && (
              <AnimatedText
                as="blockquote"
                className="font-display text-base sm:text-lg text-ink leading-relaxed mb-5"
                delay={0.1}
                stagger={0.025}
              >
                {`"${message}"`}
              </AnimatedText>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {name && (
                <div>
                  <AnimatedText
                    as="p"
                    className="font-display text-base font-semibold text-ink"
                    delay={0.2}
                  >
                    {name}
                  </AnimatedText>
                  {designation && (
                    <AnimatedText
                      as="p"
                      className="text-xs text-slate"
                      delay={0.25}
                    >
                      {designation}
                    </AnimatedText>
                  )}
                </div>
              )}

              {linkLabel && linkUrl && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2 border border-ink text-ink text-xs font-medium tracking-wide hover:bg-ink hover:text-parchment transition-colors duration-200 rounded-full"
                >
                  {linkLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessageBlock;