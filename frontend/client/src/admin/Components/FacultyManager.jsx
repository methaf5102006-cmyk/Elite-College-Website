import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getFaculty,
  getDepartmentsForFilter,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember
} from '../../services/facultyService';

const emptyForm = { name: '', designation: '', qualification: '', department: '', email: '', bio: '' };

const FacultyManager = () => {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facultyData, deptData] = await Promise.all([getFaculty(), getDepartmentsForFilter()]);
      setFaculty(facultyData);
      setDepartments(deptData);
    } catch (err) {
      toast.error('Failed to load faculty data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateFacultyMember(editingId, form.name, form.designation, form.qualification, form.department, form.email, form.bio, file);
        toast.success('Faculty member updated');
      } else {
        await createFacultyMember(form.name, form.designation, form.qualification, form.department, form.email, form.bio, file);
        toast.success('Faculty member added');
      }
      resetForm();
      e.target.reset();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      designation: member.designation,
      qualification: member.qualification || '',
      department: member.department?._id || '',
      email: member.email || '',
      bio: member.bio || '',
    });
    setFile(null);
    window.scrollTo({ top: document.getElementById('faculty-form')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try {
      await deleteFacultyMember(id);
      toast.success('Faculty member deleted');
      setFaculty((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Faculty Management</h2>

      <form id="faculty-form" onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-6 mb-8 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Designation</label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              required
              placeholder="e.g. Assistant Professor"
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Qualification</label>
            <input
              type="text"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
              placeholder="e.g. PhD Computer Science"
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Bio (optional)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="font-body text-sm text-charcoal block mb-1">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm font-body"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Faculty Member' : 'Add Faculty Member'}
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
        <p className="font-body text-slate">Loading faculty...</p>
      ) : faculty.length === 0 ? (
        <p className="font-body text-slate">No faculty members yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {faculty.map((member) => (
            <div key={member._id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
              {member.image && (
                <img src={member.image} alt={member.name} className="w-full h-32 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-display text-base text-ink mb-1">{member.name}</h3>
                <p className="font-body text-xs text-slate mb-1">{member.designation}</p>
                <p className="font-body text-xs text-slate/70 mb-3">{member.department?.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-body px-3 py-1.5 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyManager;