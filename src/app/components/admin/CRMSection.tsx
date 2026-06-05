import { useState, useEffect } from 'react';
import {
  UserPlus, Phone, Mail, MapPin, XCircle, RefreshCw,
  X, Loader2, Search, MessageSquare, Plus,
} from 'lucide-react';
import { leads as leadsApi } from '../../lib/api';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: 'school' | 'student' | 'faculty';
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  notes?: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: 'New',       color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  contacted: { label: 'Contacted', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  converted: { label: 'Converted', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  rejected:  { label: 'Rejected',  color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
};

const TYPE_CONFIG: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  school:  { label: 'School',  icon: '🏫', bg: 'bg-violet-100', color: 'text-violet-700' },
  student: { label: 'Student', icon: '🎓', bg: 'bg-blue-100',   color: 'text-blue-700' },
  faculty: { label: 'Faculty', icon: '👨‍🏫', bg: 'bg-amber-100', color: 'text-amber-700' },
};

const PIPELINE_COLS: { key: Lead['status']; label: string; color: string }[] = [
  { key: 'new',       label: '🆕 New',       color: 'border-blue-300 bg-blue-50/50' },
  { key: 'contacted', label: '📞 Contacted', color: 'border-amber-300 bg-amber-50/50' },
  { key: 'converted', label: '✅ Converted', color: 'border-emerald-300 bg-emerald-50/50' },
  { key: 'rejected',  label: '❌ Rejected',  color: 'border-red-300 bg-red-50/50' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const EMPTY: Omit<Lead, 'id' | 'created_at'> = { name: '', email: '', phone: '', location: '', type: 'student', status: 'new', notes: '' };

export function CRMSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'school' | 'student' | 'faculty'>('all');
  const [addModal, setAddModal] = useState(false);
  const [notesModal, setNotesModal] = useState<{ id: string; notes: string; name: string } | null>(null);
  const [formData, setFormData] = useState<Omit<Lead, 'id' | 'created_at'>>({ ...EMPTY });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await leadsApi.list();
    if (error) toast.error('Failed to load leads: ' + error);
    else {
      const list = (data as Lead[]) || [];
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLeads(list);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    setUpdatingId(id);
    const { error } = await leadsApi.update(id, { status });
    if (error) { toast.error('Failed to update'); setUpdatingId(null); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Lead marked as ${status}`);
    setUpdatingId(null);
  };

  const saveNotes = async () => {
    if (!notesModal) return;
    const { error } = await leadsApi.update(notesModal.id, { notes: notesModal.notes });
    if (error) { toast.error('Failed to save notes'); return; }
    setLeads(prev => prev.map(l => l.id === notesModal.id ? { ...l, notes: notesModal.notes } : l));
    toast.success('Notes saved');
    setNotesModal(null);
  };

  const deleteLead = async (id: string, name: string) => {
    if (!confirm(`Remove lead "${name}"?`)) return;
    const { error } = await leadsApi.delete(id);
    if (error) { toast.error('Failed to delete'); return; }
    setLeads(prev => prev.filter(l => l.id !== id));
    toast.success('Lead removed');
  };

  const addLead = async () => {
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    const { data, error } = await leadsApi.create(formData);
    if (error) { toast.error('Failed to add lead'); setSaving(false); return; }
    setLeads(prev => [{ ...(data as Lead) }, ...prev]);
    toast.success('Lead added!');
    setAddModal(false);
    setFormData({ ...EMPTY });
    setSaving(false);
  };

  const filtered = leads.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const byStatus = (status: Lead['status']) => filtered.filter(l => l.status === status);

  const conversionRate = leads.length ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">CRM & Lead Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track potential schools, students, and faculty</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLeads} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-[#F5A623]/30">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Leads', val: leads.length, color: 'from-blue-500 to-blue-600' },
          { label: 'New', val: leads.filter(l => l.status === 'new').length, color: 'from-slate-500 to-slate-600' },
          { label: 'Contacted', val: leads.filter(l => l.status === 'contacted').length, color: 'from-amber-500 to-amber-600' },
          { label: 'Converted', val: leads.filter(l => l.status === 'converted').length, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Conversion Rate', val: `${conversionRate}%`, color: 'from-violet-500 to-violet-600' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{val}</p>
          </div>
        ))}
      </div>

      {/* View toggle + Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(['pipeline', 'table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${view === v ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {v === 'pipeline' ? '🗂 Pipeline' : '📋 Table'}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
        </div>
        <div className="flex gap-2">
          {(['all', 'school', 'student', 'faculty'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${typeFilter === t ? 'bg-[#0A2540] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {t === 'all' ? 'All' : TYPE_CONFIG[t]?.icon + ' ' + t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
        </div>
      ) : view === 'pipeline' ? (
        /* Kanban Pipeline */
        <div className="grid lg:grid-cols-4 gap-4">
          {PIPELINE_COLS.map(col => {
            const colLeads = byStatus(col.key);
            return (
              <div key={col.key} className={`rounded-2xl border-2 ${col.color} p-4 min-h-64`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-700 text-sm">{col.label}</h3>
                  <span className="w-6 h-6 rounded-full bg-white shadow text-xs font-bold text-slate-700 flex items-center justify-center">{colLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {colLeads.map(lead => {
                    const typeConf = TYPE_CONFIG[lead.type];
                    const statusConf = STATUS_CONFIG[lead.status];
                    return (
                      <div key={lead.id} className="bg-white rounded-xl p-4 shadow-sm border border-white hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{typeConf?.icon}</span>
                            <span className="font-bold text-slate-800 text-sm leading-tight">{lead.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeConf?.bg} ${typeConf?.color}`}>{typeConf?.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{lead.location}</p>
                        {lead.notes && <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2 mb-3 line-clamp-2">{lead.notes}</p>}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {col.key === 'new' && (
                            <button onClick={() => updateStatus(lead.id, 'contacted')} disabled={updatingId === lead.id}
                              className="flex-1 text-xs py-1.5 bg-amber-100 text-amber-700 rounded-lg font-semibold hover:bg-amber-200 transition-colors">
                              Contact
                            </button>
                          )}
                          {col.key === 'contacted' && (
                            <>
                              <button onClick={() => updateStatus(lead.id, 'converted')} disabled={updatingId === lead.id}
                                className="flex-1 text-xs py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200">
                                Convert
                              </button>
                              <button onClick={() => updateStatus(lead.id, 'rejected')} disabled={updatingId === lead.id}
                                className="flex-1 text-xs py-1.5 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200">
                                Reject
                              </button>
                            </>
                          )}
                          {(col.key === 'converted' || col.key === 'rejected') && (
                            <button onClick={() => updateStatus(lead.id, 'new')} disabled={updatingId === lead.id}
                              className="flex-1 text-xs py-1.5 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200">
                              Reset
                            </button>
                          )}
                          <button type="button" onClick={() => setNotesModal({ id: lead.id, notes: lead.notes || '', name: lead.name })}
                            aria-label="Open notes" className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {colLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <div className="text-3xl mb-2 opacity-30">📭</div>
                      <p className="text-xs">No leads here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Lead', 'Type', 'Contact', 'Location', 'Status', 'Added', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(lead => {
                    const sc = STATUS_CONFIG[lead.status];
                    const tc = TYPE_CONFIG[lead.type];
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A2540] to-[#F5A623] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{lead.name}</p>
                              {lead.notes && <p className="text-xs text-slate-400 truncate max-w-32">{lead.notes}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tc?.bg} ${tc?.color}`}>{tc?.icon} {tc?.label}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{lead.email}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3 text-slate-400" />{lead.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{lead.location}</td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${sc?.bg} ${sc?.color} ${sc?.border}`}>{sc?.label}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{timeAgo(lead.created_at)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {lead.status === 'new' && (
                              <button type="button" onClick={() => updateStatus(lead.id, 'contacted')} className="px-2 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200">Call</button>
                            )}
                            {lead.status === 'contacted' && (
                              <button type="button" onClick={() => updateStatus(lead.id, 'converted')} className="px-2 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200">Convert</button>
                            )}
                            <button type="button" onClick={() => setNotesModal({ id: lead.id, notes: lead.notes || '', name: lead.name })} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200" aria-label={`Add notes for ${lead.name}`}>
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => deleteLead(lead.id, lead.name)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" aria-label={`Delete lead ${lead.name}`}>
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Lead Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-lg">Add New Lead</h3>
              <button onClick={() => setAddModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name *</label>
                  <input type="text" placeholder="Lead name or organization" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                {[
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                  { label: 'Phone', key: 'phone', type: 'text', placeholder: '+91 XXXXX XXXXX' },
                  { label: 'Location', key: 'location', type: 'text', placeholder: 'City, State' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={(formData as any)[key]}
                      onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
                  <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    <option value="school">🏫 School</option>
                    <option value="student">🎓 Student</option>
                    <option value="faculty">👨‍🏫 Faculty</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
                  <textarea rows={2} placeholder="Initial notes..." value={formData.notes || ''} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] resize-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={addLead} disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540]">Notes — {notesModal.name}</h3>
              <button onClick={() => setNotesModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6">
              <textarea value={notesModal.notes} onChange={e => setNotesModal(p => p ? { ...p, notes: e.target.value } : null)}
                rows={4} placeholder="Add notes about this lead..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623] resize-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setNotesModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={saveNotes} className="flex-1 py-2.5 bg-[#F5A623] text-white rounded-xl text-sm font-bold hover:bg-[#E09512]">Save Notes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}