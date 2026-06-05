import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard, GraduationCap, School, TrendingUp, FileText, Bell,
  LogOut, Menu, X, BarChart3, UserCog, ChevronRight,
  Home, Database, Zap, Settings
} from 'lucide-react';
import { getCurrentUser, signOut } from '../lib/auth';
import { toast } from 'sonner';
import { OverviewSection } from '../components/admin/OverviewSection';
import { RealTimeApplications } from '../components/admin/RealTimeApplications';
import { SchoolManagement } from '../components/admin/SchoolManagement';
import { FacultyManagement } from '../components/admin/FacultyManagement';
import { StudentManagement } from '../components/admin/StudentManagement';
import { AnalyticsSection } from '../components/admin/AnalyticsSection';
import { RevenueTracking } from '../components/admin/RevenueTracking';
import { CRMSection } from '../components/admin/CRMSection';
import { AdminSettings } from '../components/admin/AdminSettings';
import { seed, applications as appsApi, adminSettings } from '../lib/api';

type TabType = 'overview' | 'applications' | 'schools' | 'faculty' | 'students' | 'analytics' | 'revenue' | 'crm' | 'settings';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Admin');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await appsApi.list();
      if (!error && data) {
        const newApps = data.filter((app: any) => app.status === 'new');
        newApps.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNotifications(newApps);
        setNewApplicationsCount(newApps.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuth = async () => {
    const { user } = await getCurrentUser();
    if (!user) {
      navigate('/admin/login');
    } else {
      setUserEmail(user.email || '');
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Admin');
      try {
        const { data } = await adminSettings.get();
        if (data) {
          if (data.profileName) setUserName(data.profileName);
          if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
        }
      } catch (e) {
        console.error('Failed to load admin settings', e);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Logged out successfully');
      navigate('/admin/login');
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seed();
      toast.success('Sample data loaded! Refreshing...');
      window.location.reload();
    } catch {
      toast.error('Failed to load seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Key metrics' },
    { id: 'applications', label: 'Applications', icon: Bell, badge: newApplicationsCount, description: 'Non-ASA applicants', highlight: true },
    { id: 'schools', label: 'Schools', icon: School, description: 'Partner schools' },
    { id: 'faculty', label: 'Faculty', icon: UserCog, description: 'Teaching staff' },
    { id: 'students', label: 'Students', icon: GraduationCap, description: 'Enrolled students' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Charts & trends' },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp, description: 'Financial data' },
    { id: 'crm', label: 'CRM', icon: FileText, description: 'Lead management' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Admin preferences' },
  ];

  const activeItem = menuItems.find(m => m.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#0A2540] sticky top-0 z-50 shadow-xl">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: brand + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#F5A623] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-tight">ARYAVARTA</h1>
                <p className="text-[#F5A623]/80 text-xs leading-tight">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Center: breadcrumb (desktop) */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{activeItem?.label}</span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            

            <a
              href="/"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              title="Back to site"
            >
              <Home className="w-5 h-5" />
            </a>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {newApplicationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                    {newApplicationsCount > 9 ? '9+' : newApplicationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-[#0A2540]">Notifications</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                      {newApplicationsCount} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        {notifications.map(app => (
                          <div 
                            key={app.id}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setShowNotifications(false);
                              setActiveTab('applications');
                            }}
                          >
                            <p className="text-sm font-semibold text-[#0A2540] truncate">{app.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5 capitalize">New {app.type} application</p>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div 
                    className="p-2 text-center border-t border-slate-100 bg-slate-50 text-xs font-semibold text-[#F5A623] hover:text-[#d9901b] cursor-pointer"
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('applications');
                    }}
                  >
                    View all applications
                  </div>
                </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E09512] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-right hidden sm:block max-w-[120px]">
                <p className="text-white text-sm font-semibold truncate">{userName}</p>
                <p className="text-slate-400 text-xs truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative top-0 left-0 h-full lg:h-auto w-72 lg:w-64 bg-white border-r border-slate-200 transition-transform duration-300 z-40 flex flex-col shadow-xl lg:shadow-none lg:top-auto`}>
          {/* Sidebar header (mobile) */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
            <span className="font-bold text-[#0A2540]">Navigation</span>
            <button type="button" onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close navigation">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">Menu</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as TabType); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0A2540] to-[#1a3f6f] text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive ? 'bg-white/20' : item.highlight ? 'bg-red-50 group-hover:bg-red-100' : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-red-500' : 'text-slate-500 group-hover:text-[#0A2540]'}`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm leading-tight">{item.label}</div>
                    <div className={`text-xs leading-tight truncate ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{item.description}</div>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${isActive ? 'bg-white text-[#0A2540]' : 'bg-red-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-gradient-to-r from-[#F5A623]/10 to-[#0A2540]/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#F5A623]" />
                <span className="text-xs font-bold text-[#0A2540]">ARYAVARTA Admin</span>
              </div>
              <p className="text-xs text-slate-500">School Infrastructure as a Service platform management</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-8 max-w-[1400px]">
            {activeTab === 'overview' && <OverviewSection onNavigate={setActiveTab} />}
            {activeTab === 'applications' && (
              <RealTimeApplications 
                onCountChange={(count) => {
                  setNewApplicationsCount(count);
                  fetchNotifications();
                }} 
              />
            )}
            {activeTab === 'schools' && <SchoolManagement />}
            {activeTab === 'faculty' && <FacultyManagement />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'analytics' && <AnalyticsSection />}
            {activeTab === 'revenue' && <RevenueTracking />}
            {activeTab === 'crm' && <CRMSection />}
            {activeTab === 'settings' && <AdminSettings userEmail={userEmail} initialName={userName} onUpdate={checkAuth} />}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}