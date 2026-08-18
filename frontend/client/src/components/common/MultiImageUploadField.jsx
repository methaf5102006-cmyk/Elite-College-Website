import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/uploadService';

const MultiImageUploadField = ({ label, value, onChange }) => {
  const images = Array.isArray(value) ? value : [];
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(files.map((file) => uploadImage(file)));
      onChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // same file dobara select karne dena
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, i) => i !== indexToRemove));
  };

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    onChange(reordered);
  };

  return (
    <div>
      {label && <label className="font-body text-sm text-charcoal block mb-1">{label}</label>}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm font-body"
        />
        {uploading && <span className="text-xs text-slate">Uploading...</span>}
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="h-24 w-32 rounded-lg border border-ink/10 object-cover"
              />
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex flex-col items-center justify-center gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="text-parchment text-xs px-1.5 py-0.5 bg-ink/50 rounded disabled:opacity-30"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="text-parchment text-xs px-1.5 py-0.5 bg-ink/50 rounded disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-parchment text-xs px-2 py-0.5 bg-ink/70 rounded hover:bg-ink"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUploadField;