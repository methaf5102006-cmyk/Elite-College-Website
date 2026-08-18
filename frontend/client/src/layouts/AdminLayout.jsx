import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  GraduationCap,
  Wrench,
  Bell,
  CalendarDays,
  Images,
  Info,
  Mail,
  LogOut,
  UserCog,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/faculty', label: 'Faculty', icon: GraduationCap },
  { to: '/admin/facilities', label: 'Facilities', icon: Wrench },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/about', label: 'About Page', icon: Info },
  { to: '/admin/contact', label: 'Contact Messages', icon: Mail },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-parchment flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="font-display text-xl tracking-tight">EliteCollege</h2>
          <p className="font-body text-xs text-parchment/60 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition ${
                  isActive
                    ? 'bg-gold text-ink font-medium'
                    : 'text-parchment/80 hover:bg-white/10 hover:text-parchment'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <NavLink
            to="/admin/change-account"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-parchment/80 hover:bg-white/10 hover:text-parchment transition"
          >
            <UserCog size={17} strokeWidth={2} />
            Change Account
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-parchment/80 hover:bg-white/10 hover:text-parchment transition"
          >
            <LogOut size={17} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-ink/10 px-8 py-4 flex justify-between items-center">
          <div>
            <p className="font-body text-xs text-slate">Welcome back</p>
            <h1 className="font-display text-xl text-ink">{admin?.name || 'Admin'}</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center font-body text-sm font-medium text-ink">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;