import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, XCircle, Eye, Clock, Mail, Phone, BookOpen,
  Sparkles, RefreshCw, Loader2, MessageSquare, X, Search,
  Bell, Zap, Building2,
} from 'lucide-react';
import { applications as appsApi } from '../../lib/api';
import { toast } from 'sonner';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'student' | 'faculty' | 'school';
  role_or_class: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

interface Props {
  onCountChange: (count: number) => void;
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  reviewed: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RealTimeApplications({ onCountChange }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'faculty' | 'school'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notesModal, setNotesModal] = useState<{ id: string; notes: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchApplications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data, error } = await appsApi.list();
      if (error) throw new Error(error);
      const list = (data as Application[]) || [];
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setApplications(list);
    } catch (e) {
      console.error('Error fetching applications:', e);
      if (!silent) toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => fetchApplications(true), 30000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  useEffect(() => {
    const newCount = applications.filter(a => a.status === 'new').length;
    onCountChange(newCount);
  }, [applications, onCountChange]);

  const updateStatus = async (id: string, status: Application['status']) => {
    setUpdating(id);
    try {
      const { error } = await appsApi.update(id, { status });
      if (error) throw new Error(error);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Application marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const saveNotes = async () => {
    if (!notesModal) return;
    const { id, notes } = notesModal;
    setUpdating(id);
    try {
      const { error } = await appsApi.update(id, { notes });
      if (error) throw new Error(error);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, notes } : a));
      toast.success('Notes saved');
      setNotesModal(null);
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setUpdating(null);
    }
  };

  const convertApplication = async (id: string, type: 'student' | 'faculty') => {
    await updateStatus(id, 'approved');
    toast.success(`Converted to ${type === 'student' ? 'enrolled student' : 'active faculty'}!`, { icon: '🎉' });
  };

  const filtered = applications.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase()) && !a.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const counts = {
    new: applications.filter(a => a.status === 'new').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-[#0A2540]">Real-Time Applications</h1>
            <span className="flex items-center gap-1 px-2 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-full text-xs font-bold">
              <Zap className="w-3 h-3" /> LIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm">Track and manage Non-ASA student and faculty applications</p>
        </div>
        <button
          onClick={() => fetchApplications(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'New', count: counts.new, color: 'from-blue-500 to-blue-600', status: 'new' as const },
          { label: 'Reviewed', count: counts.reviewed, color: 'from-amber-500 to-amber-600', status: 'reviewed' as const },
          { label: 'Approved', count: counts.approved, color: 'from-emerald-500 to-emerald-600', status: 'approved' as const },
          { label: 'Rejected', count: counts.rejected, color: 'from-red-500 to-red-600', status: 'rejected' as const },
        ].map(card => (
          <button
            key={card.status}
            onClick={() => setStatusFilter(statusFilter === card.status ? 'all' : card.status)}
            className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all text-left ${statusFilter === card.status ? 'border-[#F5A623] shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{card.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>{card.count}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'student', 'faculty', 'school'] as const).map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`px-4 py-2 rounded-xl text-[0px] font-semibold transition-all ${typeFilter === f ? 'bg-[#0A2540] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <span className="text-sm">{f === 'all' ? 'All' : f === 'student' ? 'Students' : f === 'faculty' ? 'Faculty' : 'Schools'}</span>
                {f === 'all' ? 'All' : f === 'student' ? '🎓 Students' : '👨‍🏫 Faculty'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-slate-300" />
          </div>
          <p className="font-semibold text-slate-700 mb-1">No applications found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters or use "Load Data" in the top bar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                app.status === 'new' ? 'border-blue-200 bg-gradient-to-r from-blue-50/30 to-white' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#F5A623] flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  {app.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#0A2540]">{app.name}</h3>
                    {app.status === 'new' && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full animate-pulse">NEW</span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[app.status]}`}>
                      {app.status.toUpperCase()}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[0px] font-bold ${
                      app.type === 'student'
                        ? 'bg-blue-100 text-blue-700'
                        : app.type === 'faculty'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      <span className="text-xs">{app.type === 'student' ? 'Student' : app.type === 'faculty' ? 'Faculty' : 'School'}</span>
                      {app.type === 'student' ? '🎓 Student' : '👨‍🏫 Faculty'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{app.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{app.role_or_class}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{timeAgo(app.created_at)}</span>
                    </div>
                  </div>

                  {app.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                      <strong>Note:</strong> {app.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {updating === app.id ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-[#F5A623]" />
                    </div>
                  ) : (
                    <>
                      {app.status === 'new' && (
                        <button onClick={() => updateStatus(app.id, 'reviewed')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors text-sm font-semibold">
                          <Eye className="w-4 h-4" /> Review
                        </button>
                      )}
                      {(app.status === 'new' || app.status === 'reviewed') && (
                        <>
                          <button onClick={() => updateStatus(app.id, 'approved')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors text-sm font-semibold">
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => updateStatus(app.id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm font-semibold">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && app.type !== 'school' && (
                        <button onClick={() => convertApplication(app.id, app.type)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md">
                          <Sparkles className="w-4 h-4" />
                          Convert
                        </button>
                      )}
                      {app.status === 'approved' && app.type === 'school' && (
                        <span className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold">
                          <Building2 className="w-4 h-4" />
                          Partnership Lead
                        </span>
                      )}
                      <button
                        onClick={() => setNotesModal({ id: app.id, notes: app.notes || '' })}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-semibold"
                      >
                        <MessageSquare className="w-4 h-4" /> Notes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-lg">Add Notes</h3>
              <button onClick={() => setNotesModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={notesModal.notes}
                onChange={e => setNotesModal(prev => prev ? { ...prev, notes: e.target.value } : null)}
                rows={4}
                placeholder="Add remarks or notes about this application..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setNotesModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={saveNotes}
                  className="flex-1 py-2.5 bg-[#F5A623] text-white rounded-xl text-sm font-bold hover:bg-[#E09512] transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
