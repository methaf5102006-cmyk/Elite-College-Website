import { useState } from 'react';
import ImageCarouselModal from '../common/ImageCarouselModal';

const GalleryGrid = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!images || images.length === 0) {
    return <p className="font-body text-slate text-center py-10">No images have been added to this category yet.</p>;
  }

  const imageUrls = images.map((img) => img.imageUrl);
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <button
            key={img._id}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square rounded-lg overflow-hidden border border-ink/10 hover:opacity-90 transition"
          >
            <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {selectedImage && (
        <ImageCarouselModal
          images={imageUrls}
          title={selectedImage.title}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          interval={3000}
        />
      )}
    </>
  );
};

export default GalleryGrid;