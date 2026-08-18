import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { submitContactQuery } from '../../services/contactService';

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

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await submitContactQuery(data);
      toast.success('Your message has been sent. We will contact you soon.');
      reset();
      setSubmitted(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            className="font-body text-slate mb-6"
          >
            Your message has been received. Our team will get back to you soon.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSubmitted(false)}
            className="font-body text-sm text-gold-dark border border-gold/40 rounded-lg px-5 py-2 hover:bg-gold/10 transition"
          >
            Send another message
          </motion.button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          variants={formContainer}
          className="bg-white rounded-xl border border-ink/10 p-6 space-y-4"
        >
          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Full Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="Your name"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="you@example.com"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Phone (optional)</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="03XX-XXXXXXX"
            />
          </motion.div>

          <motion.div variants={fieldVariant}>
            <label className="font-body text-sm text-charcoal block mb-1">Message</label>
            <textarea
              rows={4}
              {...register('message', { required: 'Message is required' })}
              className="w-full border border-ink/20 rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              placeholder="Your question or message..."
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </AnimatePresence>
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
                  Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;