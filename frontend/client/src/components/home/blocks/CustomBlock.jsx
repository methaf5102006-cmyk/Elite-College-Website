const CustomBlock = ({ content = {} }) => {
  const { heading = "", text = "", image = "", buttonLabel = "", buttonUrl = "" } = content;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="bg-white border border-ink/10 rounded-2xl p-8 sm:p-10">
        {heading && (
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-4">
            {heading}
          </h2>
        )}

        {image && (
          <img
            src={image}
            alt={heading}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        {text && (
          <p className="text-slate leading-relaxed whitespace-pre-line mb-6">{text}</p>
        )}

        {buttonLabel && buttonUrl && (
          <a
            href={buttonUrl}
            className="inline-flex items-center px-6 py-3 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-lg transition"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
};

export default CustomBlock;