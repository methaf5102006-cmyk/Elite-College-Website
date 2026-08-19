import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/courseService';

const emptyForm = { title: '', duration: '', description: '', department: '' };

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
      setError('');
    } catch {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title || '',
      duration: course.duration || '',
      description: course.description || '',
      department: course.department || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCourse(editingId, form);
      } else {
        await createCourse(form);
      }
      await loadCourses();
      closeModal();
    } catch {
      setError('Failed to save. Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourse(deleteTarget._id);
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id));
    } catch {
      setError('Failed to delete. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Courses</h2>
          <p className="font-body text-sm text-slate mt-1">
            Add, edit, or delete all courses here.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-ink text-parchment font-body text-sm px-4 py-2.5 rounded-lg hover:bg-ink-light transition"
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-body px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center font-body text-slate text-sm">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-body text-slate text-sm">No courses have been added yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 font-body text-sm text-gold-dark hover:underline"
            >
              Add your first course
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink/10 bg-parchment/50">
                <th className="font-body text-xs uppercase tracking-wide text-slate px-5 py-3">Title</th>
                <th className="font-body text-xs uppercase tracking-wide text-slate px-5 py-3">Department</th>
                <th className="font-body text-xs uppercase tracking-wide text-slate px-5 py-3">Duration</th>
                <th className="font-body text-xs uppercase tracking-wide text-slate px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3.5 font-body text-sm text-ink font-medium">{course.title}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-slate">{course.department || '—'}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-slate">{course.duration || '—'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 text-slate hover:text-ink transition inline-flex"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="p-2 text-slate hover:text-red-600 transition inline-flex"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-lg text-ink">
                {editingId ? 'Edit Course' : 'Add Course'}
              </h3>
              <button onClick={closeModal} className="text-slate hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs text-slate mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-slate mb-1">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-slate mb-1">Duration</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 4 Years"
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block font-body text-xs text-slate mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 font-body text-sm text-slate hover:text-ink transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ink text-parchment font-body text-sm px-4 py-2 rounded-lg hover:bg-ink-light transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <h3 className="font-display text-lg text-ink mb-2">Delete this course?</h3>
            <p className="font-body text-sm text-slate mb-5">
              "{deleteTarget.title}" will be permanently deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 font-body text-sm text-slate hover:text-ink transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white font-body text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;