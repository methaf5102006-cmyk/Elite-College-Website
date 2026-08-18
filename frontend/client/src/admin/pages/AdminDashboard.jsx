import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GalleryManager from '../components/GalleryManager';
import NewsManager from '../components/NewsManager';
import NoticeManager from '../components/NoticeManager';
import EventManager from '../components/EventManager';
import FacultyManager from '../components/FacultyManager';
import AcademicsManager from '../components/AcademicsManager';
import AdmissionManager from '../components/AdmissionManager';
import ContactManager from '../components/ContactManager';
import FacilityManager from '../components/FacilityManager';
import AboutManager from '../components/AboutManager';
import HomeBuilder from '../components/HomeBuilder';
import SiteSettingsManager from '../components/SiteSettingsManager';
import ScholarshipManager from '../components/ScholarshipManager';
import TeamManager from '../components/TeamManager';
import ActivityLogManager from '../components/ActivityLogManager';

// Each tab specifies which roles are allowed to see it
const TABS = [
  { id: 'home', label: 'Home Builder', component: HomeBuilder, roles: ['superadmin', 'manager'] },
  { id: 'about', label: 'About', component: AboutManager, roles: ['superadmin', 'manager'] },
  { id: 'academics', label: 'Academics', component: AcademicsManager, roles: ['superadmin', 'manager'] },
  { id: 'faculty', label: 'Faculty', component: FacultyManager, roles: ['superadmin', 'manager'] },
  { id: 'facilities', label: 'Facilities', component: FacilityManager, roles: ['superadmin', 'manager'] },
  { id: 'admissions', label: 'Admissions', component: AdmissionManager, roles: ['superadmin', 'manager'] },
  { id: 'scholarships', label: 'Scholarships', component: ScholarshipManager, roles: ['superadmin', 'manager'] },
  { id: 'gallery', label: 'Gallery', component: GalleryManager, roles: ['superadmin', 'manager'] },
  { id: 'news', label: 'News', component: NewsManager, roles: ['superadmin', 'manager'] },
  { id: 'events', label: 'Events', component: EventManager, roles: ['superadmin', 'manager'] },
  { id: 'notices', label: 'Notices', component: NoticeManager, roles: ['superadmin', 'manager'] },
  { id: 'contact', label: 'Contact', component: ContactManager, roles: ['superadmin', 'manager'] },
  { id: 'settings', label: 'Site Settings', component: SiteSettingsManager, roles: ['superadmin'] }, // superadmin only
  { id: 'team', label: 'Team', component: TeamManager, roles: ['superadmin'] }, // superadmin only
  { id: 'activity', label: 'Activity Log', component: ActivityLogManager, roles: ['superadmin'] }, // superadmin only
];

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // Only tabs allowed for this role
  const visibleTabs = TABS.filter((tab) => tab.roles.includes(admin?.role));

  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const ActiveComponent = visibleTabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-parchment p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-ink">
          Welcome, {admin?.name}
          <span className="text-sm font-body text-ink/50 ml-2">
            ({admin?.role === 'superadmin' ? 'Super Admin' : 'Manager'})
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/change-account')}
            className="bg-white border border-ink/20 text-ink font-body px-4 py-2 rounded-lg hover:bg-parchment transition"
          >
            Change Admin Account
          </button>
          <button
            onClick={handleLogout}
            className="bg-ink text-parchment font-body px-4 py-2 rounded-lg hover:bg-ink-light transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-ink/10 pb-4">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-body text-sm px-4 py-2 rounded-full border transition ${
              activeTab === tab.id
                ? 'bg-ink text-parchment border-ink'
                : 'bg-white text-ink border-ink/20 hover:border-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AdminDashboard;