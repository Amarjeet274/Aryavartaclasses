import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, X, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { students as studentsApi, schools as schoolsApi } from '../../lib/api';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  class: string;
  school: string;
  school_id?: string;
  fee_status: 'paid' | 'pending' | 'overdue';
  amount: number;
  email?: string;
  phone?: string;
  enrolled_at?: string;
}

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const EMPTY: Omit<Student, 'id'> = { name: '', class: 'Class 10', school: '', school_id: '', fee_status: 'pending', amount: 25000, email: '', phone: '' };

const FEE_STYLES: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
};

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [feeFilter, setFeeFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [classFilter, setClassFilter] = useState('all');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Omit<Student, 'id'>; id?: string } | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [sRes, schRes] = await Promise.all([studentsApi.list(), schoolsApi.list()]);
    if (!sRes.error) setStudents((sRes.data as Student[]) || []);
    if (!schRes.error) setSchools(((schRes.data as any[]) || []).map((s: any) => ({ id: s.id, name: s.name })));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.data.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const { data, error } = await studentsApi.create({ ...modal.data, enrolled_at: new Date().toISOString() });
        if (error) throw new Error(error);
        setStudents(prev => [data as Student, ...prev]);
        toast.success('Student enrolled!');
      } else {
        const { data, error } = await studentsApi.update(modal.id!, modal.data);
        if (error) throw new Error(error);
        setStudents(prev => prev.map(s => s.id === modal.id ? { ...(data as Student) } : s));
        toast.success('Student updated!');
      }
      setModal(null);
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from students?`)) return;
    const { error } = await studentsApi.delete(id);
    if (error) { toast.error('Failed to remove student'); return; }
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success('Student removed');
  };

  const filtered = students.filter(s => {
    if (feeFilter !== 'all' && s.fee_status !== feeFilter) return false;
    if (classFilter !== 'all' && s.class !== classFilter) return false;
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !(s.school || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalFees = students.filter(s => s.fee_status === 'paid').reduce((a, s) => a + s.amount, 0);
  const overdueCount = students.filter(s => s.fee_status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Student Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage enrolled students and fee tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setModal({ mode: 'add', data: { ...EMPTY } })} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-[#F5A623]/30">
            <Plus className="w-4 h-4" /> Enroll Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', val: students.length, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Fees Collected', val: `₹${(totalFees / 100000).toFixed(1)}L`, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Fee Pending', val: students.filter(s => s.fee_status === 'pending').length, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
          { label: 'Overdue', val: overdueCount, icon: XCircle, color: overdueCount > 0 ? 'from-red-500 to-red-600' : 'from-slate-400 to-slate-500' },
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white text-slate-700 font-medium">
          <option value="all">All Classes</option>
          {CLASSES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
            <button key={f} onClick={() => setFeeFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${feeFilter === f ? 'bg-[#0A2540] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Student', 'Class', 'School', 'Fee Amount', 'Fee Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A2540] to-[#F5A623] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                          {student.email && <p className="text-xs text-slate-400 truncate max-w-32">{student.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{student.class}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{student.school}</td>
                    <td className="px-5 py-4 font-semibold text-slate-700 text-sm">₹{student.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${FEE_STYLES[student.fee_status]}`}>
                        {student.fee_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal({ mode: 'edit', data: { name: student.name, class: student.class, school: student.school, school_id: student.school_id, fee_status: student.fee_status, amount: student.amount, email: student.email, phone: student.phone }, id: student.id })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(student.id, student.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-lg">{modal.mode === 'add' ? 'Enroll New Student' : 'Edit Student'}</h3>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input type="text" placeholder="Student name" value={modal.data.name}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, name: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class</label>
                  <select value={modal.data.class} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, class: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">School</label>
                  <select value={modal.data.school_id || ''} onChange={e => {
                    const s = schools.find(sc => sc.id === e.target.value);
                    setModal(p => p ? { ...p, data: { ...p.data, school_id: e.target.value, school: s?.name || '' } } : null);
                  }} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    <option value="">— Select School —</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" placeholder="student@email.com" value={modal.data.email || ''}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, email: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" value={modal.data.phone || ''}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, phone: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fee Amount (₹)</label>
                  <input type="number" min="0" value={modal.data.amount}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, amount: Number(e.target.value) } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fee Status</label>
                  <select value={modal.data.fee_status} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, fee_status: e.target.value as any } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : modal.mode === 'add' ? 'Enroll Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
