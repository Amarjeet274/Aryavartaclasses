import { useState, useEffect } from 'react';
import {
  Users, TrendingUp, School, GraduationCap, Bell, ArrowUpRight,
  IndianRupee, Clock, Loader2,
} from 'lucide-react';
import { schools as schoolsApi, faculty as facultyApi, students as studentsApi, applications as appsApi } from '../../lib/api';

interface Props {
  onNavigate?: (tab: any) => void;
}

const GRADIENT_CARDS = [
  { key: 'totalStudents', label: 'Total Students', icon: Users, gradient: 'from-blue-500 to-blue-700', light: 'bg-blue-50', text: 'text-blue-600', arrow: '+12 this month' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: IndianRupee, gradient: 'from-emerald-500 to-emerald-700', light: 'bg-emerald-50', text: 'text-emerald-600', arrow: '+₹2.5L vs last month' },
  { key: 'activeSchools', label: 'Active Schools', icon: School, gradient: 'from-violet-500 to-violet-700', light: 'bg-violet-50', text: 'text-violet-600', arrow: '+1 new partner' },
  { key: 'totalFaculty', label: 'Total Faculty', icon: GraduationCap, gradient: 'from-amber-500 to-amber-700', light: 'bg-amber-50', text: 'text-amber-600', arrow: '4.7 avg rating' },
  { key: 'newApplications', label: 'New Applications', icon: Bell, gradient: 'from-rose-500 to-rose-700', light: 'bg-rose-50', text: 'text-rose-600', arrow: 'Needs review' },
];

const ACTIVITY_ICONS: Record<string, { icon: any; color: string }> = {
  student: { icon: GraduationCap, color: 'bg-blue-100 text-blue-600' },
  faculty: { icon: Users, color: 'bg-violet-100 text-violet-600' },
  revenue: { icon: IndianRupee, color: 'bg-emerald-100 text-emerald-600' },
  application: { icon: Bell, color: 'bg-rose-100 text-rose-600' },
  school: { icon: School, color: 'bg-amber-100 text-amber-600' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function OverviewSection({ onNavigate }: Props) {
  const [metrics, setMetrics] = useState({ totalStudents: 0, totalRevenue: 0, activeSchools: 0, totalFaculty: 0, newApplications: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [schoolRes, facultyRes, studentRes, appRes] = await Promise.all([
        schoolsApi.list(), facultyApi.list(), studentsApi.list(), appsApi.list(),
      ]);
      const schoolData = (schoolRes.data as any[]) || [];
      const facultyData = (facultyRes.data as any[]) || [];
      const studentData = (studentRes.data as any[]) || [];
      const appData = (appRes.data as any[]) || [];

      const totalRevenue = schoolData.reduce((s: number, sc: any) => s + (sc.monthly_revenue || 0), 0);
      const activeSchools = schoolData.filter((s: any) => s.status === 'active').length;
      const newApplications = appData.filter((a: any) => a.status === 'new').length;

      setMetrics({ totalStudents: studentData.length, totalRevenue, activeSchools, totalFaculty: facultyData.length, newApplications });

      // Build activity feed
      const activities: any[] = [
        ...studentData.slice(0, 3).map((s: any) => ({ type: 'student', text: `${s.name} enrolled`, sub: s.school, time: s.enrolled_at || s.created_at })),
        ...appData.filter((a: any) => a.status === 'new').slice(0, 2).map((a: any) => ({ type: 'application', text: `New ${a.type} application`, sub: a.name, time: a.created_at })),
        ...schoolData.slice(0, 2).map((s: any) => ({ type: 'school', text: `${s.name} is ${s.status}`, sub: s.location, time: s.created_at })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

      setRecentActivity(activities);
    } catch (e) {
      console.error('Error fetching overview:', e);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayValue = (key: string) => {
    if (key === 'totalRevenue') return `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`;
    return String(metrics[key as keyof typeof metrics]);
  };

  const feeHealth = {
    paid: 72,
    pending: 20,
    overdue: 8,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening at ARYAVARTA.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {GRADIENT_CARDS.map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4" />
              <div className="h-3 bg-slate-100 rounded w-20 mb-3" />
              <div className="h-8 bg-slate-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {GRADIENT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                onClick={() => card.key === 'newApplications' && onNavigate?.('applications')}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group ${card.key === 'newApplications' ? 'cursor-pointer hover:border-rose-200' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-[#0A2540] mb-2">{getDisplayValue(card.key)}</p>
                <p className={`text-xs font-medium ${card.text}`}>{card.arrow}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-[#0A2540] text-base">Recent Activity</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
                  <div className="flex-1"><div className="h-3 bg-slate-100 rounded w-40 mb-2" /><div className="h-2.5 bg-slate-100 rounded w-24" /></div>
                  <div className="h-2.5 bg-slate-100 rounded w-12" />
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No recent activity. Load sample data to get started.</p>
              </div>
            ) : recentActivity.map((act, idx) => {
              const info = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.student;
              const Icon = info.icon;
              return (
                <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{act.text}</p>
                    <p className="text-xs text-slate-500 truncate">{act.sub}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{act.time ? timeAgo(act.time) : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Fee Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-[#0A2540] text-base mb-5">Fee Collection Health</h2>
            <div className="space-y-4">
              {[
                { label: 'Paid', pct: feeHealth.paid, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                { label: 'Pending', pct: feeHealth.pending, color: 'bg-amber-400', textColor: 'text-amber-600' },
                { label: 'Overdue', pct: feeHealth.overdue, color: 'bg-rose-500', textColor: 'text-rose-600' },
              ].map(({ label, pct, color, textColor }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className={`text-sm font-bold ${textColor}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#0A2540] to-[#1a3f6f] rounded-2xl p-6 text-white">
            <h2 className="font-bold text-base mb-4">Quick Actions</h2>
            <div className="space-y-2.5">
              {[
                { label: 'Review Applications', tab: 'applications', badge: metrics.newApplications },
                { label: 'View Revenue Report', tab: 'revenue', badge: 0 },
                { label: 'Manage Schools', tab: 'schools', badge: 0 },
                { label: 'CRM Pipeline', tab: 'crm', badge: 0 },
              ].map(({ label, tab, badge }) => (
                <button
                  key={tab}
                  onClick={() => onNavigate?.(tab as any)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium group"
                >
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    {badge > 0 && <span className="w-5 h-5 bg-[#F5A623] rounded-full text-xs flex items-center justify-center font-bold">{badge}</span>}
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}