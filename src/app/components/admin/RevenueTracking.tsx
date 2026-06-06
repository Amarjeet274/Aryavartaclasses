import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, School, RefreshCw, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { schools as schoolsApi, students as studentsApi } from '../../lib/api';

const PIE_COLORS = ['#0A2540', '#F5A623', '#10b981', '#8b5cf6', '#ef4444'];

const EXPENSES = [
  { category: 'Faculty Salaries', amount: 480000, pct: 26.7 },
  { category: 'Marketing & Enrollment', amount: 180000, pct: 10 },
  { category: 'Operations & Tech', amount: 120000, pct: 6.7 },
  { category: 'Study Materials', amount: 60000, pct: 3.3 },
  { category: 'Admin & Misc', amount: 60000, pct: 3.3 },
];

const fmtL = (v: number) => `₹${(v / 100000).toFixed(1)}L`;
const fmtK = (v: number) => `₹${(v / 1000).toFixed(0)}K`;

export function RevenueTracking() {
  const [schools, setSchools] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [sRes, stRes] = await Promise.all([schoolsApi.list(), studentsApi.list()]);
    if (!sRes.error) setSchools((sRes.data as any[]) || []);
    if (!stRes.error) setStudents((stRes.data as any[]) || []);
    setLoading(false);
  };

  const totalMonthly = schools.reduce((a, s) => a + (s.monthly_revenue || 0), 0);
  const schoolShare = totalMonthly * 0.35; // weighted avg ~35%
  const aryavartaGross = totalMonthly * 0.65;
  const totalExpenses = EXPENSES.reduce((a, e) => a + e.amount, 0);
  const netProfit = aryavartaGross - totalExpenses;

  const schoolBreakdown = schools.map(s => ({
    name: s.name,
    share: s.revenue_share,
    revenue: s.monthly_revenue || 0,
    students: s.total_students || 0,
    earning: ((s.monthly_revenue || 0) * s.revenue_share) / 100,
    aryavarta: ((s.monthly_revenue || 0) * (100 - s.revenue_share)) / 100,
  }));

  const pieData = schoolBreakdown.filter(s => s.revenue > 0).map((s, i) => ({
    name: s.name?.split(' ').slice(0, 2).join(' ') || `School ${i + 1}`,
    value: s.revenue,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Revenue Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor earnings and profit distribution</p>
        </div>
        <button onClick={fetchData} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Gross Revenue', val: fmtL(totalMonthly), sub: 'current database total', icon: IndianRupee, gradient: 'from-[#0A2540] to-[#1a3f6f]', positive: true },
          { label: 'School Share', val: fmtL(schoolShare), sub: 'estimated at 35%', icon: School, gradient: 'from-[#F5A623] to-[#E09512]', positive: true },
          { label: 'ARYAVARTA Gross', val: fmtL(aryavartaGross), sub: 'before expenses', icon: TrendingUp, gradient: 'from-violet-500 to-violet-700', positive: true },
          { label: 'Estimated Net', val: fmtL(netProfit), sub: 'after cost assumptions', icon: TrendingUp, gradient: 'from-emerald-500 to-emerald-700', positive: netProfit >= 0 },
        ].map(({ label, val, sub, icon: Icon, gradient, positive }) => (
          <div key={label} className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-white/20' : 'bg-red-400/40'}`}>
                {positive ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{val}</p>
            <p className="text-sm opacity-70 font-medium">{label}</p>
            <p className="text-xs opacity-50 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Monthly trend */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-[#0A2540] text-base mb-1">Current Revenue Distribution</h2>
          <p className="text-xs text-slate-500 mb-6">Database values by school</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={schoolBreakdown} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: any) => fmtL(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend />
              <Bar dataKey="earning" fill="#F5A623" radius={[4, 4, 0, 0]} name="School Share" />
              <Bar dataKey="aryavarta" fill="#0A2540" radius={[4, 4, 0, 0]} name="ARYAVARTA Share" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-[#0A2540] text-base mb-1">Revenue by School</h2>
          <p className="text-xs text-slate-500 mb-4">Monthly distribution</p>
          {loading ? (
            <div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-[#F5A623]" /></div>
          ) : pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} paddingAngle={2} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => fmtL(Number(v))} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-600 truncate max-w-28">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{fmtL(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* School breakdown table */}
      {loading ? (
        <div className="flex items-center justify-center h-32 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-7 h-7 animate-spin text-[#F5A623]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-[#0A2540]">School-wise Revenue Share</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {['School', 'Rev Share', 'Students', 'Gross Revenue', 'School Earning', 'ARYAVARTA'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {schoolBreakdown.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Load sample data to see school breakdown</td></tr>
                ) : schoolBreakdown.map(school => (
                  <tr key={school.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{school.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${school.share >= 40 ? 'bg-violet-100 text-violet-700' : school.share >= 30 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {school.share}% Tier {school.share >= 40 ? 3 : school.share >= 30 ? 2 : 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{school.students}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{fmtL(school.revenue)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{fmtL(school.earning)}</td>
                    <td className="px-6 py-4 font-bold text-[#0A2540]">{fmtL(school.revenue - school.earning)}</td>
                  </tr>
                ))}
              </tbody>
              {schoolBreakdown.length > 0 && (
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-6 py-4 font-bold text-[#0A2540]">TOTAL</td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{schoolBreakdown.reduce((a, s) => a + s.students, 0)}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{fmtL(schoolBreakdown.reduce((a, s) => a + s.revenue, 0))}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{fmtL(schoolBreakdown.reduce((a, s) => a + s.earning, 0))}</td>
                    <td className="px-6 py-4 font-bold text-[#0A2540]">{fmtL(schoolBreakdown.reduce((a, s) => a + s.revenue - s.earning, 0))}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Expense Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="font-bold text-[#0A2540] mb-2">ARYAVARTA Expense Breakdown</h2>
        <p className="text-xs text-slate-500 mb-6">Monthly operating costs</p>
        <div className="space-y-4">
          {EXPENSES.map(exp => (
            <div key={exp.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{exp.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{exp.pct}%</span>
                  <span className="text-sm font-bold text-slate-800">{fmtK(exp.amount)}</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-[#0A2540] to-[#F5A623] h-2.5 rounded-full transition-all" style={{ width: `${exp.pct * 3}%` } as React.CSSProperties} />
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-700">Total Expenses</span>
            <span className="text-lg font-bold text-slate-800">{fmtL(totalExpenses)}</span>
          </div>
          <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
            <span className="font-bold text-emerald-800">Estimated Net Profit</span>
            <span className="text-xl font-bold text-emerald-600">{fmtL(netProfit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
