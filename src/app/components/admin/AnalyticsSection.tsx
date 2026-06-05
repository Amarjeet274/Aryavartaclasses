import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, IndianRupee, School, Activity, ArrowUpRight } from 'lucide-react';

const enrollmentData = [
  { month: 'Oct', students: 42, target: 50 },
  { month: 'Nov', students: 65, target: 70 },
  { month: 'Dec', students: 78, target: 80 },
  { month: 'Jan', students: 88, target: 90 },
  { month: 'Feb', students: 102, target: 100 },
  { month: 'Mar', students: 115, target: 110 },
  { month: 'Apr', students: 125, target: 120 },
];

const revenueData = [
  { month: 'Oct', revenue: 1050000, target: 1000000 },
  { month: 'Nov', revenue: 1625000, target: 1500000 },
  { month: 'Dec', revenue: 1950000, target: 1800000 },
  { month: 'Jan', revenue: 2200000, target: 2000000 },
  { month: 'Feb', revenue: 2550000, target: 2500000 },
  { month: 'Mar', revenue: 2875000, target: 2750000 },
  { month: 'Apr', revenue: 3000000, target: 3000000 },
];

const applicationData = [
  { month: 'Oct', students: 8, faculty: 2 },
  { month: 'Nov', students: 12, faculty: 3 },
  { month: 'Dec', students: 15, faculty: 4 },
  { month: 'Jan', students: 18, faculty: 5 },
  { month: 'Feb', students: 22, faculty: 4 },
  { month: 'Mar', students: 20, faculty: 6 },
  { month: 'Apr', students: 16, faculty: 3 },
];

const schoolPerformanceData = [
  { name: "St. Mary's", students: 45, revenue: 1125, rating: 4.8 },
  { name: 'DPS Noida', students: 38, revenue: 950, rating: 4.7 },
  { name: 'KV Gurgaon', students: 42, revenue: 1050, rating: 4.6 },
  { name: 'DAV Faridabad', students: 28, revenue: 700, rating: 4.5 },
];

const feeStatusData = [
  { name: 'Paid', value: 72, color: '#10b981' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
  { name: 'Overdue', value: 8, color: '#ef4444' },
];

const KPI_CARDS = [
  { label: 'Growth Rate', value: '+24%', sub: 'vs last quarter', icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
  { label: 'Student Retention', value: '94%', sub: 'renewal rate', icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-600' },
  { label: 'Revenue Growth', value: '+18%', sub: 'month over month', icon: IndianRupee, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', textColor: 'text-violet-600' },
  { label: 'New Schools', value: '+2', sub: 'this quarter', icon: School, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-600' },
];

const fmtRupee = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

export function AnalyticsSection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540]">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Track performance metrics and growth trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.bg} ${kpi.textColor}`}>
                  <ArrowUpRight className="w-3 h-3 inline mr-0.5" />{kpi.value}
                </span>
              </div>
              <p className="text-3xl font-bold text-[#0A2540] mb-1">{kpi.value}</p>
              <p className="text-xs text-slate-500 font-medium">{kpi.label} • {kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row 1: Enrollment + Revenue */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-[#0A2540] text-base">Student Enrollment Growth</h2>
              <p className="text-xs text-slate-500 mt-0.5">Actual vs Target</p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">+24% ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="studentsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend />
              <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Target" />
              <Area type="monotone" dataKey="students" stroke="#F5A623" strokeWidth={3} fill="url(#studentsGrad)" name="Students" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-[#0A2540] text-base">Monthly Revenue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Revenue vs Target</p>
            </div>
            <span className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-full">+18% ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: any) => fmtRupee(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="revenue" fill="#0A2540" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Applications + Fee Status */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="font-bold text-[#0A2540] text-base">Application Trends (Non-ASA)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Student & Faculty applications per month</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={applicationData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend />
              <Bar dataKey="students" fill="#0A2540" radius={[4, 4, 0, 0]} name="Student Applications" />
              <Bar dataKey="faculty" fill="#F5A623" radius={[4, 4, 0, 0]} name="Faculty Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="font-bold text-[#0A2540] text-base">Fee Collection Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">Overall payment health</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={feeStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {feeStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-2">
            {feeStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* School Performance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-[#0A2540] text-base">School Performance Comparison</h2>
          <p className="text-xs text-slate-500 mt-0.5">Revenue, students, and ratings per school</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['School', 'Students', 'Revenue (₹K/mo)', 'Rating', 'Performance'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schoolPerformanceData.map(school => (
                <tr key={school.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{school.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{school.students}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">₹{school.revenue}K</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="font-bold text-slate-800">{school.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-24">
                        <div className="bg-gradient-to-r from-[#0A2540] to-[#F5A623] h-2 rounded-full" style={{ width: `${(school.students / 50) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-8">{Math.round((school.students / 50) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
