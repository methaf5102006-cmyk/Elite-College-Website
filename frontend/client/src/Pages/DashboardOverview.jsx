import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BookOpen,
  Building2,
  GraduationCap,
  Wrench,
  Bell,
  CalendarDays,
  Images,
  Mail,
  ArrowRight,
} from 'lucide-react';

const sections = [
  { key: 'courses', label: 'Courses', endpoint: '/courses', icon: BookOpen, path: '/admin/courses' },
  { key: 'departments', label: 'Departments', endpoint: '/departments', icon: Building2, path: '/admin/departments' },
  { key: 'faculty', label: 'Faculty', endpoint: '/faculty', icon: GraduationCap, path: '/admin/faculty' },
  { key: 'facilities', label: 'Facilities', endpoint: '/facilities', icon: Wrench, path: '/admin/facilities' },
  { key: 'notices', label: 'Notices', endpoint: '/notices', icon: Bell, path: '/admin/notices' },
  { key: 'events', label: 'Events', endpoint: '/events', icon: CalendarDays, path: '/admin/events' },
  { key: 'gallery', label: 'Gallery Items', endpoint: '/gallery', icon: Images, path: '/admin/gallery' },
  { key: 'contact', label: 'Messages', endpoint: '/contact', icon: Mail, path: '/admin/contact' },
];

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      const results = await Promise.all(
        sections.map(async (s) => {
          try {
            const { data } = await api.get(s.endpoint);
            const list = data.data || data;
            return [s.key, Array.isArray(list) ? list.length : 0];
          } catch {
            return [s.key, null]; // null = failed to load
          }
        })
      );
      setCounts(Object.fromEntries(results));
      setLoading(false);
    };
    loadCounts();
  }, []);

  return (
    <div>
      <p className="font-body text-slate mb-6">
        Manage all of your college's information from here — courses, faculty,
        departments, facilities, notices, events, and gallery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className="text-left bg-white border border-ink/10 rounded-xl p-5 hover:border-gold hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-leaf-light flex items-center justify-center">
                <Icon size={19} className="text-ink" strokeWidth={2} />
              </div>
              <ArrowRight
                size={16}
                className="text-slate group-hover:text-gold group-hover:translate-x-0.5 transition"
              />
            </div>
            <p className="font-display text-2xl text-ink">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-ink/5 rounded animate-pulse" />
              ) : counts[key] === null ? (
                <span className="text-sm text-slate font-body">—</span>
              ) : (
                counts[key]
              )}
            </p>
            <p className="font-body text-sm text-slate mt-1">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;