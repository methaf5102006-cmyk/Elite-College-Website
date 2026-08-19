import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllEventsForAdmin, createEvent, updateEvent, deleteEvent } from '../../services/eventService';

const emptyForm = { title: '', description: '', eventDate: '', location: '' };

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  // New files picked in the current session (not yet uploaded)
  const [newFiles, setNewFiles] = useState([]);
  // Existing image URLs (only relevant while editing) that the admin wants to keep
  const [existingImages, setExistingImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEventsForAdmin();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setNewFiles([]);
    setExistingImages([]);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    e.target.value = ''; // allow re-selecting the same file(s) later
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateEvent(editingId, form.title, form.description, form.eventDate, form.location, newFiles, existingImages);
        toast.success('Event updated');
      } else {
        await createEvent(form.title, form.description, form.eventDate, form.location, newFiles);
        toast.success('Event created');
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : '',
      location: event.location || '',
    });
    // Backward-compatible: supports event.images (array, new) or event.image (string, old)
    const images = Array.isArray(event.images) && event.images.length > 0
      ? event.images
      : event.image
      ? [event.image]
      : [];
    setExistingImages(images);
    setNewFiles([]);
    window.scrollTo({ top: document.getElementById('event-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const inputClass = "w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40";
  const labelClass = "font-body text-sm text-charcoal block mb-1";

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Events Management</h2>

      <form id="event-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
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
            <label className={labelClass}>Event Date</label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location (optional)</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
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
            rows={4}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Images (optional, multiple allowed)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="text-sm font-body"
          />

          {/* Existing images (only while editing) */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img src={url} alt={`Existing ${index + 1}`} className="h-24 w-32 rounded-lg border border-ink/10 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center text-parchment text-xs font-body"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Newly selected files, not yet uploaded */}
          {newFiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {newFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="h-24 w-32 rounded-lg border-2 border-gold/50 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center text-parchment text-xs font-body"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
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
        <p className="font-body text-slate">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="font-body text-slate">No events yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((event) => {
            const images = Array.isArray(event.images) && event.images.length > 0
              ? event.images
              : event.image
              ? [event.image]
              : [];

            return (
              <div key={event._id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
                {images[0] && (
                  <div className="relative">
                    <img src={images[0]} alt={event.title} className="w-full h-32 object-cover" />
                    {images.length > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-body px-2 py-0.5 rounded-full">
                        +{images.length - 1} more
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-display text-base text-ink mb-1">{event.title}</h3>
                  <p className="font-body text-xs text-slate mb-2">
                    {new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {event.location && ` — ${event.location}`}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
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

export default EventManager;