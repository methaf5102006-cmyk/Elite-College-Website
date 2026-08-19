import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScholarships } from '../services/scholarshipService';
import Loader from '../components/common/Loader';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getScholarships(); // only active ones
        setScholarships(data);
      } catch (err) {
        setError('Failed to load scholarships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate font-body">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-parchment min-h-screen">
      <section className="bg-ink text-parchment py-16 px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl mb-3">Scholarships</h1>
        <p className="font-body max-w-2xl mx-auto text-parchment/80">
          Explore the scholarship opportunities available to our students.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {loading ? (
          <Loader />
        ) : scholarships.length === 0 ? (
          <p className="font-body text-slate text-center">No scholarships are available at the moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {scholarships.map((item) => (
              <div key={item._id} className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col">
                <h3 className="font-display text-xl text-ink mb-2">{item.title}</h3>
                <p className="font-body text-sm text-slate mb-3">{item.description}</p>
                {item.eligibility && (
                  <p className="font-body text-xs text-slate mb-1">
                    <span className="font-semibold text-ink">Eligibility: </span>{item.eligibility}
                  </p>
                )}
                {item.amount && (
                  <p className="font-body text-xs text-gold-dark mb-1 font-semibold">{item.amount}</p>
                )}
                {item.deadline && (
                  <p className="font-body text-xs text-slate/70 mb-4">
                    Deadline: {new Date(item.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}

                <Link
                  to={`/admissions?scholarship=${encodeURIComponent(item.title)}`}
                  className="mt-auto inline-flex items-center justify-center bg-gold hover:bg-gold-dark text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Scholarships;