import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} from '../../services/facilityService';
import MultiImageUploadField from '../../components/common/MultiImageUploadField';

const emptyForm = { title: '', description: '', icon: '', images: [], order: 0 };

const FacilityManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getFacilities();
      setFacilities(data);
    } catch (err) {
      toast.error('Failed to load facilities');
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
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await updateFacility(editingId, payload);
        toast.success('Facility updated');
      } else {
        await createFacility(payload);
        toast.success('Facility added');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (facility) => {
    setEditingId(facility._id);
    // Backward-compatible: old docs may still have a single "image" string
    const images = Array.isArray(facility.images) && facility.images.length > 0
      ? facility.images
      : facility.image
      ? [facility.image]
      : [];

    setForm({
      title: facility.title || '',
      description: facility.description || '',
      icon: facility.icon || '',
      images,
      order: facility.order ?? 0,
    });
    window.scrollTo({ top: document.getElementById('facility-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility?')) return;
    try {
      await deleteFacility(id);
      toast.success('Facility deleted');
      setFacilities((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
  const labelClass = "font-body text-sm text-charcoal block mb-1";

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Facilities Management</h2>

      <form id="facility-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Icon (react-icons/fa name, optional)</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. FaBook"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <MultiImageUploadField
            label="Facility Images (optional, multiple allowed)"
            value={form.images}
            onChange={(urls) => setForm({ ...form, images: urls })}
          />
          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Facility' : 'Add Facility'}
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
        <p className="font-body text-slate">Loading facilities...</p>
      ) : facilities.length === 0 ? (
        <p className="font-body text-slate">No facilities yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {facilities.map((facility) => {
            const images = Array.isArray(facility.images) && facility.images.length > 0
              ? facility.images
              : facility.image
              ? [facility.image]
              : [];

            return (
              <div key={facility._id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
                {images[0] && (
                  <div className="relative">
                    <img src={images[0]} alt={facility.title} className="w-full h-32 object-cover" />
                    {images.length > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-body px-2 py-0.5 rounded-full">
                        +{images.length - 1} more
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-display text-base text-ink mb-1">{facility.title}</h3>
                  <p className="font-body text-xs text-slate mb-3 line-clamp-2">{facility.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(facility)}
                      className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(facility._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacilityManager;