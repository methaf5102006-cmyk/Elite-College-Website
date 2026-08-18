const MapEmbed = () => {
  return (
    <div className="rounded-xl overflow-hidden border border-ink/10 h-full min-h-[300px]">
      <iframe
        title="EliteCollege Location"
        src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL_HERE"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '300px' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapEmbed;