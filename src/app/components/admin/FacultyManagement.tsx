import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Star, Award, X, Loader2, Search, RefreshCw, Mail, Phone, BookOpen } from 'lucide-react';
import { faculty as facultyApi, schools as schoolsApi } from '../../lib/api';
import { toast } from 'sonner';

interface Faculty {
  id: string;
  name: string;
  subject: string;
  school: string;
  school_id?: string;
  rating: number;
  students: number;
  status: 'active' | 'inactive';
  email?: string;
  phone?: string;
  experience?: number;
}

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Economics'];

const EMPTY: Omit<Faculty, 'id'> = { name: '', subject: 'Mathematics', school: '', school_id: '', rating: 4.5, students: 0, status: 'active', email: '', phone: '', experience: 0 };

export function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: Omit<Faculty, 'id'>; id?: string } | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [fRes, sRes] = await Promise.all([facultyApi.list(), schoolsApi.list()]);
    if (!fRes.error) setFaculty((fRes.data as Faculty[]) || []);
    if (!sRes.error) setSchools(((sRes.data as any[]) || []).map((s: any) => ({ id: s.id, name: s.name })));
    setLoading(false);
  };

  const openAdd = () => setModal({ mode: 'add', data: { ...EMPTY } });
  const openEdit = (f: Faculty) => setModal({ mode: 'edit', data: { name: f.name, subject: f.subject, school: f.school, school_id: f.school_id, rating: f.rating, students: f.students, status: f.status, email: f.email, phone: f.phone, experience: f.experience }, id: f.id });

  const handleSave = async () => {
    if (!modal) return;
    if (!modal.data.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const { data, error } = await facultyApi.create(modal.data);
        if (error) throw new Error(error);
        setFaculty(prev => [data as Faculty, ...prev]);
        toast.success('Faculty added!');
      } else {
        const { data, error } = await facultyApi.update(modal.id!, modal.data);
        if (error) throw new Error(error);
        setFaculty(prev => prev.map(f => f.id === modal.id ? { ...(data as Faculty) } : f));
        toast.success('Faculty updated!');
      }
      setModal(null);
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from faculty?`)) return;
    const { error } = await facultyApi.delete(id);
    if (error) { toast.error('Failed to remove faculty'); return; }
    setFaculty(prev => prev.filter(f => f.id !== id));
    toast.success('Faculty removed');
  };

  const filtered = faculty.filter(f =>
    !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.school || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating = faculty.length ? (faculty.reduce((a, f) => a + f.rating, 0) / faculty.length).toFixed(1) : '—';
  const totalStudents = faculty.reduce((a, f) => a + f.students, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage tutors and teaching staff</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#F5A623]/30">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Faculty', val: faculty.length, icon: GraduationCap, color: 'from-violet-500 to-violet-600' },
          { label: 'Active', val: faculty.filter(f => f.status === 'active').length, icon: Award, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Avg Rating', val: avgRating, icon: Star, color: 'from-amber-500 to-amber-600' },
          { label: 'Total Students', val: totalStudents, icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
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

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, subject, or school..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-600">No faculty found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#F5A623] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A2540] leading-tight">{teacher.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{teacher.experience ? `${teacher.experience} yrs exp` : 'Faculty'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(teacher)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(teacher.id, teacher.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">{teacher.subject}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {teacher.status}
                  </span>
                </div>
                {teacher.school && (
                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {teacher.school}
                  </p>
                )}
                {teacher.email && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" /> {teacher.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(teacher.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                  <span className="text-sm font-bold text-slate-700 ml-1">{teacher.rating}</span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{teacher.students} students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-[#0A2540] text-lg">{modal.mode === 'add' ? 'Add Faculty Member' : 'Edit Faculty'}</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input type="text" placeholder="Dr. Rajesh Kumar" value={modal.data.name}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, name: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                  <select value={modal.data.subject} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, subject: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign to School</label>
                  <select value={modal.data.school_id || ''} onChange={e => {
                    const s = schools.find(sc => sc.id === e.target.value);
                    setModal(p => p ? { ...p, data: { ...p.data, school_id: e.target.value, school: s?.name || '' } } : null);
                  }} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 bg-white">
                    <option value="">— Unassigned —</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" placeholder="email@example.com" value={modal.data.email || ''}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, email: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input type="text" placeholder="+91 98765 XXXXX" value={modal.data.phone || ''}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, phone: e.target.value } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience (years)</label>
                  <input type="number" min="0" value={modal.data.experience || 0}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, experience: Number(e.target.value) } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rating (1–5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={modal.data.rating}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, rating: Number(e.target.value) } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">No. of Students</label>
                  <input type="number" min="0" value={modal.data.students}
                    onChange={e => setModal(p => p ? { ...p, data: { ...p.data, students: Number(e.target.value) } } : null)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40 focus:border-[#F5A623]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select value={modal.data.status} onChange={e => setModal(p => p ? { ...p, data: { ...p.data, status: e.target.value as any } } : null)}
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
                className="flex-1 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : modal.mode === 'add' ? 'Add Faculty' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
