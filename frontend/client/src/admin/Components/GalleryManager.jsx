import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../../services/galleryService';

const CATEGORIES = [
  'Annual Function',
  'Bonfire Night',
  'Tour',
  'Exam Session',
  'Sessions',
  'PTM',
  'Convocation',
  'Thesis Projects',
  'Campus Life'
];

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
    } catch (err) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = ''; // allow re-selecting / picking more files later
  };

  const removeSelectedFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one image file');
      return;
    }
    try {
      setUploading(true);
      // Upload every selected file under the same title & category.
      // (If only one file is picked, this behaves exactly like before.)
      await Promise.all(files.map((file) => addGalleryImage(title, category, file)));
      toast.success(`${files.length} image(s) uploaded`);
      setTitle('');
      setFiles([]);
      e.target.reset();
      fetchImages();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      toast.success('Image deleted');
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Gallery Management</h2>

      <form onSubmit={handleUpload} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="font-body text-sm text-charcoal block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex-1">
            <label className="font-body text-sm text-charcoal block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="font-body text-sm text-charcoal block mb-1">Image Files (multiple allowed)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm font-body"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60 whitespace-nowrap"
          >
            {uploading ? `Uploading ${files.length || ''}...` : `Upload ${files.length > 1 ? `${files.length} Images` : 'Image'}`}
          </button>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index + 1}`}
                  className="h-20 w-28 rounded-lg border-2 border-gold/50 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center text-parchment text-xs font-body"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {loading ? (
        <p className="font-body text-slate">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="font-body text-slate">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="relative group rounded-lg overflow-hidden border border-ink/10">
              <img src={img.imageUrl} alt={img.title} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2 text-center">
                <p className="text-white text-xs font-body">{img.title}</p>
                <p className="text-white/70 text-[11px] font-body">{img.category}</p>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;