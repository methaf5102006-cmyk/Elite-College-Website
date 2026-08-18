import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { requestChangeOtp, verifyChangeOtp } from '../../services/adminSetupService';

const formContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const AdminChangeAccount = () => {
  const [step, setStep] = useState('form'); // form | otp
  const [currentPassword, setCurrentPassword] = useState('');
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRequestChange = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await requestChangeOtp(currentPassword, name, newEmail, newPassword);
      toast.success('OTP sent to the new email');
      setStep('otp');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyChange = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await verifyChangeOtp(newEmail, otp);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      toast.success('Admin account updated. Please log in again.');
      localStorage.removeItem('adminInfo');
      navigate('/admin/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-display text-2xl text-ink text-center mb-2"
        >
          Change Admin Account
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={step + '-desc'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-body text-sm text-slate text-center mb-6"
          >
            {step === 'form'
              ? 'Confirm your current password and enter the new account details.'
              : 'Enter the OTP sent to the new email.'}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form
              key="form"
              onSubmit={handleRequestChange}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
              variants={formContainer}
              className="space-y-4"
            >
              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </motion.div>
              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">New Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </motion.div>
              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </motion.div>
              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </motion.div>
              <motion.button
                variants={fieldVariant}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {submitting ? (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-2"
                    >
                      <motion.span
                        className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                      Sending...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      Send OTP
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form
              key="otp"
              onSubmit={handleVerifyChange}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div>
                <label className="font-body text-sm text-charcoal block mb-1">6-digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {submitting ? (
                    <motion.span
                      key="verifying"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-2"
                    >
                      <motion.span
                        className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                      Verifying...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="verify"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      Verify & Update
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminChangeAccount;