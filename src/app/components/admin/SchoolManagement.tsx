import { useState, useEffect } from 'react';
import { School, Plus, Edit2, Trash2, MapPin, TrendingUp, CheckCircle2, X, Loader2, Search, RefreshCw } from 'lucide-react';
import { schools as schoolsApi } from '../../lib/api';
import { toast } from 'sonner';

interface SchoolType {
  id: string;
  name: string;
  location: string;
  revenue_share: number;
  status: 'active' | 'inactive';
  total_students: number;
  monthly_revenue: number;
  created_at?: string;
}

const EMPTY: Omit<SchoolType, 'id' | 'created_at'> = { name: '', location: '', revenue_share: 30, status: 'active', total_students: 0, monthly_revenue: 0 };

export function SchoolManagement() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Omit<SchoolType, 'id' | 'created_at'>; id?: string } | null>(null);

  useEffect(() => { fetchSchools(); }, []);

  const fetchSchools = async () => {
    setLoading(true);
    const { data, error } = await schoolsApi.list();
    if (error) toast.error('Failed to load schools: ' + error);
    else setSchools((data as SchoolType[]) || []);
    setLoading(false);
  };

  const openAdd = () => setModal({ mode: 'add', data: { ...EMPTY } });
  const openEdit = (s: SchoolType) => setModal({ mode: 'edit', data: { name: s.name, location: s.location, revenue_share: s.revenue_share, status: s.status, total_students: s.total_students, monthly_revenue: s.monthly_revenue }, id: s.id });

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.data.name.trim() || !modal.data.location.trim()) { toast.error('Name and location are required'); return; }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const { data, error } = await schoolsApi.create(modal.data);
        if (error) throw new Error(error);
        setSchools(prev => [data as SchoolType, ...prev]);
        toast.success('School added successfully!');
      } else {
        const { data, error } = await schoolsApi.update(modal.id!, modal.data);
        if (error) throw new Error(error);
        setSchools(prev => prev.map(s => s.id === modal.id ? { ...(data as SchoolType) } : s));
        toast.success('School updated successfully!');
      }
      setModal(null);
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    const { error } = await schoolsApi.delete(id);
    if (error) { toast.error('Failed to delete school'); return; }
    setSchools(prev => prev.filter(s => s.id !== id));
    toast.success('School deleted');
  };

  const toggleStatus = async (s: SchoolType) => {
    const newStatus = s.status === 'active' ? 'inactive' : 'active';
    const { error } = await schoolsApi.update(s.id, { status: newStatus });
    if (error) { toast.error('Failed to update status'); return; }
    setSchools(prev => prev.map(sc => sc.id === s.id ? { ...sc, status: newStatus } : sc));
    toast.success(`School marked as ${newStatus}`);
  };

  const filtered = schools.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = schools.reduce((acc, s) => acc + s.monthly_revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">School Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage SIaaS partner schools</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSchools} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#F5A623]/30">
            <Plus className="w-4 h-4" /> Add School
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Schools', val: schools.length, icon: School, color: 'from-blue-500 to-blue-600' },
          { label: 'Active', val: schools.filter(s => s.status === 'active').length, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Avg Revenue Share', val: schools.length ? `${Math.round(schools.reduce((a, s) => a + s.revenue_share, 0) / schools.length)}%` : '—', icon: TrendingUp, color: 'from-violet-500 to-violet-600' },
          { label: 'Total Monthly Revenue', val: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'from-amber-500 to-amber-600' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#0A2540]">{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search schools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${statusFilter === f ? 'bg-[#0A2540] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <School className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No schools found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['School', 'Location', 'Students', 'Rev. Share', 'Monthly Revenue', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(school => (
                  <tr key={school.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#F5A623] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {school.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{school.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />{school.location}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{school.total_students}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        school.revenue_share >= 40 ? 'bg-violet-100 text-violet-700' :
                        school.revenue_share >= 30 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>{school.revenue_share}%</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700 text-sm">₹{(school.monthly_revenue / 100000).toFixed(1)}L</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleStatus(school)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                          school.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}>
                        {school.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(school)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(school.id, school.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-lg">{modal.mode === 'add' ? 'Add New School' : 'Edit School'}</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'School Name *', key: 'name', type: 'text', placeholder: 'e.g. St. Mary\'s Convent School' },
                { label: 'Location *', key: 'location', type: 'text', placeholder: 'e.g. New Delhi' },
                { label: 'Total Students', key: 'total_students', type: 'number', placeholder: '0' },
                { label: 'Monthly Revenue (₹)', key: 'monthly_revenue', type: 'number', placeholder: '0' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={(modal.data as any)[key]}
                    onChange={e => setModal(prev => prev ? { ...prev, data: { ...prev.data, [key]: type === 'number' ? Number(e.target.value) : e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Revenue Share %</label>
                  <select value={modal.data.revenue_share} onChange={e => setModal(prev => prev ? { ...prev, data: { ...prev.data, revenue_share: Number(e.target.value) } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    {[20, 25, 30, 35, 40].map(v => <option key={v} value={v}>{v}% (Tier {v >= 40 ? 3 : v >= 30 ? 2 : 1})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select value={modal.data.status} onChange={e => setModal(prev => prev ? { ...prev, data: { ...prev.data, status: e.target.value as any } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : modal.mode === 'add' ? 'Add School' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
