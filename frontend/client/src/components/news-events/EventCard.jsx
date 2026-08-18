import { FiImage } from 'react-icons/fi';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const EventCard = ({ event, onImageClick }) => {
  // Backward-compatible: supports event.images (array, new) or event.image (string, old)
  const images = Array.isArray(event.images) && event.images.length > 0
    ? event.images
    : event.image
    ? [event.image]
    : [];

  const coverImage = images[0];

  return (
    <div className="bg-white rounded-xl border border-ink/10 overflow-hidden hover:shadow-md transition">
      {coverImage && (
        <div
          className="relative h-40 overflow-hidden cursor-pointer group"
          onClick={() => onImageClick && onImageClick(event)}
        >
          <img
            src={coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs font-body px-2 py-1 rounded-full">
              <FiImage size={12} />
              {images.length}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <span className="font-body text-xs bg-gold/20 text-gold-dark px-2 py-1 rounded-full">
          {formatDate(event.eventDate)}
        </span>
        <h3 className="font-body font-semibold text-ink text-lg mt-3">{event.title}</h3>
        {event.location && (
          <p className="font-body text-sm text-slate mt-1">{event.location}</p>
        )}
        <p className="font-body text-sm text-charcoal mt-2">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;