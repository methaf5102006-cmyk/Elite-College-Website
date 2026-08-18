import * as FaIcons from 'react-icons/fa';
import { FiImage } from 'react-icons/fi';

const FacilityCard = ({ facility, onImageClick }) => {
  const Icon = FaIcons[facility.icon] || FaIcons.FaBuilding;

  // Backward-compatible: supports facility.images (array, new) or facility.image (string, old)
  const images = Array.isArray(facility.images) && facility.images.length > 0
    ? facility.images
    : facility.image
    ? [facility.image]
    : [];

  const coverImage = images[0];

  return (
    <div className="bg-white rounded-xl border border-ink/10 overflow-hidden hover:shadow-md transition">
      {coverImage && (
        <div
          className="relative h-40 overflow-hidden cursor-pointer group"
          onClick={() => onImageClick && onImageClick(facility)}
        >
          <img
            src={coverImage}
            alt={facility.title}
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
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-4">
          <Icon className="text-gold text-xl" />
        </div>
        <h3 className="font-body font-semibold text-ink text-lg mb-2">{facility.title}</h3>
        <p className="font-body text-slate text-sm">{facility.description}</p>
      </div>
    </div>
  );
};

export default FacilityCard;