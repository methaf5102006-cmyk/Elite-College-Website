import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllNews, addNews, deleteNews } from '../../services/newsService';

const CATEGORIES = ['Activities', 'Sessions', 'Announcements', 'Achievements'];

const NewsManager = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [author, setAuthor] = useState('Elite College Admin');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNewsItems(data);
    } catch (err) {
      toast.error('Failed to load news items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image file');
      return;
    }
    try {
      setUploading(true);
      await addNews(title, category, author, body, file);
      toast.success('News item published');
      setTitle('');
      setBody('');
      setFile(null);
      e.target.reset();
      fetchNews();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Publish failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try {
      await deleteNews(id);
      toast.success('News item deleted');
      setNewsItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">News Management</h2>

      <form onSubmit={handleUpload} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
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
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">
            Body (each paragraph on its own line)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={6}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="text-sm font-body"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {uploading ? 'Publishing...' : 'Publish News'}
        </button>
      </form>

      {loading ? (
        <p className="font-body text-slate">Loading news items...</p>
      ) : newsItems.length === 0 ? (
        <p className="font-body text-slate">No news items yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {newsItems.map((item) => (
            <div key={item._id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <span className="text-xs text-gold font-body">{item.category}</span>
                <h3 className="font-display text-base text-ink mt-1 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-slate font-body mb-3">
                  {item.comments?.length || 0} comment{item.comments?.length === 1 ? '' : 's'}
                </p>
                <button
                  onClick={() => handleDelete(item._id)}
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

export default NewsManager;