import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset, resetPassword } from '../../services/adminAuthService';
import useAuth from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { setAdminSession } = useAuth(); // see note below if this doesn't exist in your useAuth
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await requestPasswordReset(email);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      const res = await resetPassword(email, otp, newPassword);
      toast.success('Password reset successfully');

      // Log the admin in immediately using the returned token, if your AuthContext supports it
      if (setAdminSession) {
        setAdminSession(res.data);
        navigate('/admin/dashboard');
      } else {
        navigate('/admin/login');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="font-display text-2xl text-ink text-center mb-6">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="admin@elitecollege.edu.pk"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="font-body text-sm text-slate text-center -mt-2 mb-2">
              OTP sent to <span className="font-semibold text-ink">{email}</span>
            </p>
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 tracking-widest text-center"
                placeholder="123456"
              />
            </div>
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center font-body text-sm text-slate hover:text-ink transition"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;