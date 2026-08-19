import { useState, useEffect } from 'react';
import {
  getMe,
  initiateCreateManager,
  verifyManagerOtp,
  getManagers,
  updateManager,
  changeManagerPassword,
  deleteManager,
} from '../../services/authService';

const TeamManager = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' -> 'otp'
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  // ---- Check who is logged in, before showing anything ----
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getMe(); // getMe() already returns the user object directly
        setCurrentUser(user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, []);

  const fetchManagers = async () => {
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (err) {
      // Silently ignore if the list fails to load
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'superadmin') {
      fetchManagers();
    }
  }, [currentUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInitiate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await initiateCreateManager(form);
      setMessage({ type: 'success', text: res.message || 'OTP has been sent' });
      setStep('otp');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await verifyManagerOtp(form.email, otp);
      setMessage({ type: 'success', text: 'Manager account successfully created!' });
      setForm({ name: '', email: '', password: '' });
      setOtp('');
      setStep('form');
      fetchManagers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  // ---- Edit manager ----
  const startEdit = (manager) => {
    setEditingId(manager._id);
    setEditForm({ name: manager.name, email: manager.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '' });
  };

  const saveEdit = async (id) => {
    try {
      await updateManager(id, editForm);
      setMessage({ type: 'success', text: 'Manager updated successfully' });
      cancelEdit();
      fetchManagers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  // ---- Change password ----
  const handleChangePassword = async (id, name) => {
    const newPassword = window.prompt(`Enter a new password for "${name}" (min 6 characters):`);
    if (!newPassword) return;

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      await changeManagerPassword(id, newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Password change failed' });
    }
  };

  // ---- Delete manager ----
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteManager(id);
      setMessage({ type: 'success', text: 'Manager deleted successfully' });
      fetchManagers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
    }
  };

  // ---- Access gating ----
  if (checkingAccess) {
    return (
      <div className="bg-white p-6 rounded-lg border border-ink/10 max-w-md">
        <p className="text-sm text-ink/50 font-body">Loading...</p>
      </div>
    );
  }

  if (currentUser?.role !== 'superadmin') {
    return (
      <div className="bg-white p-6 rounded-lg border border-ink/10 max-w-md">
        <h2 className="font-display text-2xl text-ink mb-2">Access Restricted</h2>
        <p className="text-sm text-ink/60 font-body">
          Only the super admin can manage team members. If you believe this is a
          mistake, please contact your administrator.
        </p>
      </div>
    );
  }

  // ---- Superadmin-only view below ----
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-lg border border-ink/10 max-w-md">
        <h2 className="font-display text-2xl text-ink mb-4">Add New Manager</h2>
        <p className="text-sm text-ink/60 mb-6 font-body">
          This account will be able to manage content, but cannot change site settings or add other admins.
        </p>

        {step === 'form' && (
          <form onSubmit={handleInitiate} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border border-ink/20 rounded-lg px-4 py-2 font-body" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border border-ink/20 rounded-lg px-4 py-2 font-body" />
            <input type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required minLength={6} className="border border-ink/20 rounded-lg px-4 py-2 font-body" />
            <button type="submit" disabled={loading} className="bg-ink text-parchment font-body px-4 py-2 rounded-lg hover:bg-ink-light transition disabled:opacity-50">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-sm text-ink/70 font-body">Enter the 6-digit OTP sent to {form.email}</p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="border border-ink/20 rounded-lg px-4 py-2 font-body tracking-widest text-center" />
            <p className="text-xs text-ink/40 font-body">
              Can't find the OTP? Please check the Spam/Junk folder as well.
            </p>
            <button type="submit" disabled={loading} className="bg-ink text-parchment font-body px-4 py-2 rounded-lg hover:bg-ink-light transition disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button type="button" onClick={() => setStep('form')} className="text-sm text-ink/50 underline font-body">
              Go back
            </button>
          </form>
        )}

        {message && (
          <p className={`text-sm font-body mt-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-ink/10 max-w-md">
        <h3 className="font-display text-xl text-ink mb-4">Existing Managers</h3>
        {managers.length === 0 ? (
          <p className="text-sm text-ink/50 font-body">No managers created yet</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {managers.map((m) => (
              <li key={m._id} className="text-sm font-body border-b border-ink/10 pb-3">
                {editingId === m._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border border-ink/20 rounded-lg px-3 py-1 font-body"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="border border-ink/20 rounded-lg px-3 py-1 font-body"
                    />
                    <div className="flex gap-3 mt-1">
                      <button onClick={() => saveEdit(m._id)} className="text-green-600 text-xs underline">Save</button>
                      <button onClick={cancelEdit} className="text-ink/50 text-xs underline">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>
                      <span className="font-semibold">{m.name}</span> — {m.email}
                    </span>
                    <div className="flex gap-3 text-xs">
                      <button onClick={() => startEdit(m)} className="text-blue-600 underline">Edit</button>
                      <button onClick={() => handleChangePassword(m._id, m.name)} className="text-amber-600 underline">Password</button>
                      <button onClick={() => handleDelete(m._id, m.name)} className="text-red-600 underline">Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamManager;