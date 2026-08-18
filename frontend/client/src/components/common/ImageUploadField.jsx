import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/uploadService';

const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadImage(file);
      onChange(uploadedUrl);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // same file dobara select karne dena
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div>
      {label && <label className="font-body text-sm text-charcoal block mb-1">{label}</label>}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm font-body"
        />
        {uploading && <span className="text-xs text-slate">Uploading...</span>}
      </div>

      {value && (
        <div className="relative group mt-3 inline-block">
          <img
            src={value}
            alt={label || 'Uploaded'}
            className="h-24 w-32 rounded-lg border border-ink/10 object-cover"
          />
          <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="text-parchment text-xs px-2 py-0.5 bg-ink/70 rounded hover:bg-ink"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;