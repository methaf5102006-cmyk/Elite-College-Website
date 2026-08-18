import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getNewsBySlug, addComment } from '../services/newsService';

const NewsDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNewsBySlug(slug);
      setItem(data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addComment(slug, name, email, website, comment);
      toast.success('Comment posted');
      setName('');
      setEmail('');
      setWebsite('');
      setComment('');
      fetchNews(); // refresh to show the new comment
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-body text-slate">Loading...</div>;
  }

  if (notFound || !item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate font-body">This news item could not be found.</p>
      </div>
    );
  }

  return (
    <main className="bg-parchment min-h-screen">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-gold/10 text-gold text-xs font-body px-3 py-1 rounded-full mb-4">
          {item.category}
        </span>

        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">{item.title}</h1>

        <div className="font-body text-sm text-slate mb-6">
          {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          &nbsp;by&nbsp; <span className="text-ink">{item.author}</span>
        </div>

        <img
          src={item.image}
          alt={item.title}
          className="w-full max-h-[420px] object-cover rounded-lg mb-8"
        />

        <div className="space-y-5 font-body text-ink/90 leading-relaxed">
          {item.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-ink/10">
          <Link to="/news" className="font-body text-sm text-gold hover:underline">
            ← Back to News & Events
          </Link>
        </div>

        {/* Existing comments */}
        {item.comments && item.comments.length > 0 && (
          <div className="mt-12 border-t border-ink/10 pt-8">
            <h3 className="font-display text-xl text-ink mb-4">
              {item.comments.length} Comment{item.comments.length > 1 ? 's' : ''}
            </h3>
            <div className="space-y-4">
              {item.comments.map((c, i) => (
                <div key={i} className="bg-white border border-ink/10 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-ink">{c.name}</p>
                  <p className="font-body text-sm text-charcoal mt-1">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-ink/10 pt-8">
          <h3 className="font-display text-xl text-ink mb-4">Leave a Comment</h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              placeholder="Comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border border-ink/20 rounded-md p-3 font-body text-sm focus:outline-none focus:border-ink"
            />
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="border border-ink/20 rounded-md p-2 text-sm font-body"
              />
              <input
                type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="border border-ink/20 rounded-md p-2 text-sm font-body"
              />
              <input
                type="text" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)}
                className="border border-ink/20 rounded-md p-2 text-sm font-body"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-parchment font-body text-sm px-5 py-2 rounded-md hover:bg-ink/90 transition disabled:opacity-60"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default NewsDetail;