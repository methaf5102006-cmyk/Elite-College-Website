import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getContactQueries, updateContactQueryStatus } from '../../services/contactService';

const ContactManager = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await getContactQueries();
      setQueries(data);
    } catch (err) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await updateContactQueryStatus(id, 'read');
      setQueries((prev) => prev.map((q) => (q._id === id ? { ...q, status: 'read' } : q)));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-ink mb-4">Contact Messages</h2>

      {loading ? (
        <p className="font-body text-slate">Loading messages...</p>
      ) : queries.length === 0 ? (
        <p className="font-body text-slate">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {queries.map((q) => (
            <div
              key={q._id}
              className={`bg-white border rounded-lg p-4 ${q.status === 'new' ? 'border-gold/50' : 'border-ink/10'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base text-ink">{q.name}</h3>
                    {q.status === 'new' && (
                      <span className="text-[10px] bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full font-body font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-slate/70">
                    {q.email} {q.phone && `• ${q.phone}`}
                  </p>
                  <p className="font-body text-sm text-charcoal mt-2">{q.message}</p>
                  <p className="font-body text-[11px] text-slate/50 mt-2">
                    {new Date(q.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {q.status === 'new' && (
                  <button
                    onClick={() => handleMarkRead(q._id)}
                    className="bg-ink/5 hover:bg-ink/10 text-ink text-xs font-body px-3 py-1.5 rounded-md transition shrink-0"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManager;