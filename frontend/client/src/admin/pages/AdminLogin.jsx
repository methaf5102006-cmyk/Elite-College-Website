import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const formContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login(email, password);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative z-10"
      >
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-2xl text-ink text-center mb-6"
        >
          Admin Login
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={formContainer}
          className="space-y-4"
        >
          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="admin@elitecollege.edu.pk"
            />
          </motion.div>

          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-ink/20 rounded-lg px-4 py-2 pr-10 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                placeholder="••••••••"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                whileTap={{ scale: 0.85 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink text-sm select-none"
                tabIndex={-1}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={showPassword ? 'open' : 'closed'}
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 10 }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
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
                  key="submitting"
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
                  Logging in...
                </motion.span>
              ) : (
                <motion.span
                  key="login"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  Login
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div variants={fieldVariant} className="text-center">
            <Link
              to="/admin/forgot-password"
              className="font-body text-sm text-slate hover:text-ink transition"
            >
              Forgot Password?
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;