import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllNoticesForAdmin, createNotice, updateNotice, deleteNotice } from '../../services/noticeService';

const emptyForm = { title: '', description: '', date: '', isActive: true };

const NoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getAllNoticesForAdmin();
      setNotices(data);
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateNotice(editingId, form.title, form.description, form.date, form.isActive);
        toast.success('Notice updated');
      } else {
        await createNotice(form.title, form.description, form.date, form.isActive);
        toast.success('Notice created');
      }
      resetForm();
      fetchNotices();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      description: notice.description,
      date: notice.date ? notice.date.slice(0, 10) : '',
      isActive: notice.isActive,
    });
    window.scrollTo({ top: document.getElementById('notice-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await deleteNotice(id);
      toast.success('Notice deleted');
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Notices Management</h2>

      <form id="notice-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="font-body text-sm text-charcoal">
            Active (visible on public site)
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Notice' : 'Add Notice'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-white border border-ink/20 text-ink font-body px-6 py-2.5 rounded-lg hover:bg-parchment transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="font-body text-slate">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="font-body text-slate">No notices yet.</p>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white border border-ink/10 rounded-lg p-4 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-base text-ink">{notice.title}</h3>
                  {!notice.isActive && (
                    <span className="text-[10px] bg-slate/10 text-slate px-2 py-0.5 rounded-full font-body">Inactive</span>
                  )}
                </div>
                <p className="font-body text-sm text-slate mb-1">{notice.description}</p>
                <p className="font-body text-xs text-slate/70">
                  {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(notice)}
                  className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notice._id)}
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

export default NoticeManager;