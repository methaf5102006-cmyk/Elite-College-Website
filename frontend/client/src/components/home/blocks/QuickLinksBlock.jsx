import * as FiIcons from "react-icons/fi";
import Card3D from "../../common/Card3D";
import AnimatedText from "../../common/AnimatedText";

const QuickLinksBlock = ({ content = {} }) => {
  const { items = [] } = content;

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, i) => {
          const Icon = FiIcons[item.icon] || FiIcons.FiLink;
          return (
            <Card3D
              key={i}
              to={item.path || "#"}
              className="group border border-ink/10 bg-white p-6 rounded-xl transition-colors duration-200 hover:border-gold"
            >
              <div style={{ transform: "translateZ(35px)" }}>
                <Icon className="text-gold-dark mb-4" size={24} />
                <AnimatedText
                  as="h3"
                  className="font-display text-lg text-ink mb-1"
                >
                  {item.label}
                </AnimatedText>
                <AnimatedText
                  as="p"
                  className="text-sm text-slate"
                  delay={0.1}
                >
                  {item.description}
                </AnimatedText>
              </div>
            </Card3D>
          );
        })}
      </div>
    </section>
  );
};

export default QuickLinksBlock;