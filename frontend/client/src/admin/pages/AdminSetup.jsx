import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkSetupStatus, requestOtp, verifyOtp } from '../../services/adminSetupService';
import useAuth from '../../hooks/useAuth';

const AdminSetup = () => {
  const [step, setStep] = useState('checking'); // checking | form | otp | done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setAdminManually } = useAuth(); // niche note dekhein

  useEffect(() => {
    const check = async () => {
      try {
        const setupDone = await checkSetupStatus();
        if (setupDone) {
          toast('Admin account pehle se ban chuka hai');
          navigate('/admin/login');
        } else {
          setStep('form');
        }
      } catch (err) {
        toast.error('Status check nahi ho saka');
        setStep('form');
      }
    };
    check();
  }, [navigate]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await requestOtp(name, email, password);
      toast.success('OTP aapke email par bhej diya gaya hai');
      setStep('otp');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Kuch ghalat ho gaya');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await verifyOtp(email, otp);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      toast.success('Admin account ban gaya!');
      navigate('/admin/dashboard');
      window.location.reload(); // AuthContext ko fresh state ke sath load karne ke liye
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Ghalat OTP');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'checking') {
    return <div className="min-h-screen flex items-center justify-center font-body text-slate">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="font-display text-2xl text-ink text-center mb-2">Admin Account Setup</h1>
        <p className="font-body text-sm text-slate text-center mb-6">
          {step === 'form' ? 'Ye sirf ek dafa hoga — apna real email istemal karein.' : 'Apne email par bheja gaya OTP daalein.'}
        </p>

        {step === 'form' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">Naam</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">Real Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60">
              {submitting ? 'Bhej rahe hain...' : 'OTP Bhejein'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="font-body text-sm text-charcoal block mb-1">6-digit OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
                className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60">
              {submitting ? 'Verify ho raha hai...' : 'Verify Karein'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;