import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { submitAdmission } from '../services/admissionService';
import { getDepartmentsForFilter } from '../services/facultyService';

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

const Admissions = () => {
  const [searchParams] = useSearchParams();
  const scholarshipName = searchParams.get('scholarship');

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: scholarshipName ? `Scholarship Application: ${scholarshipName}` : '',
    message: scholarshipName ? `I would like to apply for the ${scholarshipName}.` : ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartmentsForFilter();
        setDepartments(data);
      } catch (err) {
        // silently ignore — form still works, just without a dropdown pre-fill
      }
    };
    // Only fetch the department dropdown if this isn't a scholarship application
    if (!scholarshipName) {
      fetchDepartments();
    }
  }, [scholarshipName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitAdmission(form.fullName, form.email, form.phone, form.program, form.message);
      toast.success('Application submitted successfully');
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-parchment min-h-screen">
      <motion.section
        initial="hidden"
        animate="visible"
        className="bg-ink text-parchment py-16 px-6 text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.h1
          custom={0}
          variants={fadeUp}
          className="font-display text-4xl md:text-5xl mb-3 relative z-10"
        >
          {scholarshipName ? 'Scholarship Application' : 'Admissions'}
        </motion.h1>
        <motion.p
          custom={1}
          variants={fadeUp}
          className="font-body max-w-2xl mx-auto text-parchment/80 relative z-10"
        >
          {scholarshipName
            ? `Apply for the ${scholarshipName} below.`
            : 'Start your journey with us — fill out the form below to apply.'}
        </motion.p>
      </motion.section>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <AnimatePresence>
          {scholarshipName && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-gold/10 border border-gold/30 text-ink font-body text-sm rounded-lg px-4 py-3 mb-6 text-center overflow-hidden"
            >
              You are applying for: <span className="font-semibold">{scholarshipName}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-ink/10 rounded-xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-14 h-14 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center mx-auto mb-4 text-2xl"
              >
                ✓
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="font-display text-2xl text-ink mb-3"
              >
                Thank you!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.35 }}
                className="font-body text-slate"
              >
                Your application has been received. Our admissions team will contact you soon.
              </motion.p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              variants={formContainer}
              className="bg-white border border-ink/10 rounded-xl p-8 space-y-5"
            >
              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                />
              </motion.div>

              <motion.div variants={fieldVariant} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-charcoal block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-charcoal block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                  />
                </div>
              </motion.div>

              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">
                  {scholarshipName ? 'Scholarship' : 'Program of Interest'}
                </label>
                {scholarshipName ? (
                  <input
                    type="text"
                    value={form.program}
                    readOnly
                    className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm bg-parchment text-slate cursor-not-allowed"
                  />
                ) : departments.length > 0 ? (
                  <select
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    required
                    className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                  >
                    <option value="">Select a program</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    required
                    placeholder="e.g. BS Computer Science"
                    className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
                  />
                )}
              </motion.div>

              <motion.div variants={fieldVariant}>
                <label className="font-body text-sm text-charcoal block mb-1">Message (optional)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
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
                      Submitting...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      Submit Application
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Admissions;