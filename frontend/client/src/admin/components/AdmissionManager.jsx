import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdmissions, updateAdmissionStatus, deleteAdmission } from '../../services/admissionService';

const STATUS_OPTIONS = ['New', 'Contacted', 'Enrolled', 'Rejected'];

const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  Enrolled: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const AdmissionManager = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const data = await getAdmissions();
      setAdmissions(data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdmissionStatus(id, status);
      setAdmissions((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteAdmission(id);
      toast.success('Application deleted');
      setAdmissions((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Admission Applications</h2>

      {loading ? (
        <p className="font-body text-slate">Loading applications...</p>
      ) : admissions.length === 0 ? (
        <p className="font-body text-slate">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {admissions.map((app) => (
            <div key={app._id} className="bg-white border border-ink/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-base text-ink">{app.fullName}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-medium ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <p className="font-body text-sm text-slate">{app.program}</p>
                <p className="font-body text-xs text-slate/70 mt-1">
                  {app.email} &nbsp;•&nbsp; {app.phone}
                </p>
                {app.message && (
                  <p className="font-body text-xs text-charcoal mt-2 max-w-md">{app.message}</p>
                )}
                <p className="font-body text-[11px] text-slate/50 mt-1">
                  Submitted {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="border border-ink/20 rounded-md px-2 py-1.5 text-xs font-body focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app._id)}
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

export default AdmissionManager;