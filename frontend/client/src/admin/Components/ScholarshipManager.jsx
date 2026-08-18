import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from '../../services/scholarshipService';

const emptyForm = { title: '', description: '', eligibility: '', amount: '', deadline: '', isActive: true };

const ScholarshipManager = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getScholarships(true); // true = show all, including inactive
      setScholarships(data);
    } catch (err) {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        await updateScholarship(editingId, form);
        toast.success('Scholarship updated');
      } else {
        await createScholarship(form);
        toast.success('Scholarship added');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description,
      eligibility: item.eligibility || '',
      amount: item.amount || '',
      deadline: item.deadline ? item.deadline.slice(0, 10) : '',
      isActive: item.isActive
    });
    window.scrollTo({ top: document.getElementById('scholarship-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scholarship?')) return;
    try {
      await deleteScholarship(id);
      toast.success('Scholarship deleted');
      setScholarships((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Scholarship Management</h2>

      <form id="scholarship-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="e.g. Merit Scholarship"
            className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Eligibility (optional)</label>
            <input
              type="text"
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              placeholder="e.g. 80%+ marks in FSc"
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Amount / Benefit (optional)</label>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 50% fee waiver"
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Deadline (optional)</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active (visible to visitors)
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Scholarship' : 'Add Scholarship'}
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
        <p className="font-body text-slate">Loading scholarships...</p>
      ) : scholarships.length === 0 ? (
        <p className="font-body text-slate">No scholarships added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scholarships.map((item) => (
            <div key={item._id} className="bg-white border border-ink/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-base text-ink">{item.title}</h3>
                <span className={`text-xs font-body px-2 py-0.5 rounded-full ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="font-body text-xs text-slate mb-2 line-clamp-2">{item.description}</p>
              {item.amount && <p className="font-body text-xs text-gold-dark mb-1">{item.amount}</p>}
              {item.deadline && (
                <p className="font-body text-xs text-slate/70 mb-3">
                  Deadline: {new Date(item.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                >
                  Edit
                </button>
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

export default ScholarshipManager;