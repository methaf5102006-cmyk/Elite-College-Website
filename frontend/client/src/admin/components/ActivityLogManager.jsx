import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getActivityLogs } from '../../services/activityLogService';

const ROLE_BADGE = {
  superadmin: 'bg-ink/10 text-ink',
  manager: 'bg-gold/15 text-gold-dark',
};

const tableContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const ActivityLogManager = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getActivityLogs();
      setLogs(data);
    } catch (err) {
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="mt-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-4"
      >
        <h2 className="font-display text-2xl text-ink">Activity Log</h2>
        <motion.button
          onClick={fetchLogs}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="bg-white border border-ink/20 text-ink font-body text-sm px-4 py-2 rounded-lg hover:bg-parchment transition inline-flex items-center gap-2"
        >
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
            className="inline-block"
          >
            ⟳
          </motion.span>
          Refresh
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-body text-slate"
          >
            Loading activity...
          </motion.p>
        ) : logs.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-body text-slate"
          >
            No activity has been recorded yet.
          </motion.p>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-ink/10 rounded-xl overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead className="bg-parchment text-left">
                <tr>
                  <th className="font-body font-semibold text-charcoal px-4 py-3">User</th>
                  <th className="font-body font-semibold text-charcoal px-4 py-3">Module</th>
                  <th className="font-body font-semibold text-charcoal px-4 py-3">Action</th>
                  <th className="font-body font-semibold text-charcoal px-4 py-3">When</th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={tableContainer}
              >
                {logs.map((log) => (
                  <motion.tr
                    key={log._id}
                    variants={rowVariant}
                    className="border-t border-ink/5 hover:bg-parchment/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-body">
                      <div className="text-ink">{log.userName}</div>
                      <div className="text-xs text-slate">{log.userEmail}</div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-body px-2 py-0.5 rounded-full ${
                          ROLE_BADGE[log.role] || 'bg-slate/10 text-slate'
                        }`}
                      >
                        {log.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-ink">{log.module}</td>
                    <td className="px-4 py-3 font-body text-slate capitalize">{log.action}</td>
                    <td className="px-4 py-3 font-body text-xs text-slate">{formatTime(log.createdAt)}</td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityLogManager;