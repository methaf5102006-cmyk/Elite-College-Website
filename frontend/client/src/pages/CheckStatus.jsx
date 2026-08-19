import { useState } from 'react';
import toast from 'react-hot-toast';
import { checkAdmissionStatus } from '../services/admissionService';

const statusStyles = {
  New: 'bg-slate-100 text-slate-700 border-slate-300',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-300',
  Enrolled: 'bg-green-50 text-green-700 border-green-300',
  Rejected: 'bg-red-50 text-red-700 border-red-300'
};

const statusLabels = {
  New: 'Under Review',
  Contacted: 'Contacted by Admissions Team',
  Enrolled: 'Accepted',
  Rejected: 'Not Accepted'
};

const CheckStatus = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApplications(null);

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const data = await checkAdmissionStatus(email.trim());
      setApplications(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError('No application found with this email.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-parchment min-h-screen">
      <section className="bg-ink text-parchment py-16 px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-3">Check Application Status</h1>
        <p className="font-body max-w-2xl mx-auto text-parchment/80">
          Enter the email you used to apply and see your current admission status.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16">
        <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-xl p-8 space-y-5">
          <div>
            <label className="font-body text-sm text-charcoal block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-ink/20 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-white font-body font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {error && (
          <p className="font-body text-slate text-center mt-8">{error}</p>
        )}

        {applications && applications.length > 0 && (
          <div className="mt-8 space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white border border-ink/10 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-display text-lg text-ink">{app.program}</h3>
                    <p className="font-body text-sm text-slate mt-1">
                      Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`font-body text-xs px-3 py-1.5 rounded-full border ${statusStyles[app.status] || statusStyles.New}`}>
                    {statusLabels[app.status] || app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CheckStatus;