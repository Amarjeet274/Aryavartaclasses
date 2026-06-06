import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, IndianRupee, School, Loader2, RefreshCw } from 'lucide-react';
import {
  applications as applicationsApi,
  faculty as facultyApi,
  schools as schoolsApi,
  students as studentsApi,
} from '../../lib/api';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

function monthKey(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function recentMonths(count = 6) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (count - index - 1));
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      month: date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    };
  });
}

const formatRupee = (value: number) => `₹${(value / 100000).toFixed(1)}L`;

export function AnalyticsSection() {
  const [schools, setSchools] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [schoolResult, facultyResult, studentResult, applicationResult] = await Promise.all([
      schoolsApi.list(),
      facultyApi.list(),
      studentsApi.list(),
      applicationsApi.list(),
    ]);
    setSchools((schoolResult.data as any[]) || []);
    setFaculty((facultyResult.data as any[]) || []);
    setStudents((studentResult.data as any[]) || []);
    setApplications((applicationResult.data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const months = useMemo(() => recentMonths(), []);
  const enrollmentData = months.map(({ key, month }) => ({
    month,
    students: students.filter((student) => monthKey(student.enrolled_at || student.created_at) === key).length,
  }));
  const applicationData = months.map(({ key, month }) => ({
    month,
    students: applications.filter((item) => item.type === 'student' && monthKey(item.created_at) === key).length,
    faculty: applications.filter((item) => item.type === 'faculty' && monthKey(item.created_at) === key).length,
    schools: applications.filter((item) => item.type === 'school' && monthKey(item.created_at) === key).length,
  }));
  const feeStatusData = [
    { name: 'Paid', value: students.filter((student) => student.fee_status === 'paid').length },
    { name: 'Pending', value: students.filter((student) => student.fee_status === 'pending').length },
    { name: 'Overdue', value: students.filter((student) => student.fee_status === 'overdue').length },
  ];
  const schoolPerformance = schools.map((school) => {
    const schoolFaculty = faculty.filter((member) => member.school_id === school.id || member.school === school.name);
    const rating = schoolFaculty.length
      ? schoolFaculty.reduce((sum, member) => sum + Number(member.rating || 0), 0) / schoolFaculty.length
      : 0;
    return {
      name: school.name,
      students: Number(school.total_students || 0),
      revenue: Number(school.monthly_revenue || 0),
      rating,
    };
  });
  const totalRevenue = schools.reduce((sum, school) => sum + Number(school.monthly_revenue || 0), 0);
  const paidRate = students.length
    ? Math.round((students.filter((student) => student.fee_status === 'paid').length / students.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Current metrics calculated from SQLite data</p>
        </div>
        <button onClick={fetchData} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50" title="Refresh data">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Students', value: students.length, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Paid Fee Rate', value: `${paidRate}%`, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Monthly Revenue', value: formatRupee(totalRevenue), icon: IndianRupee, color: 'from-violet-500 to-violet-600' },
          { label: 'Active Schools', value: schools.filter((school) => school.status === 'active').length, icon: School, color: 'from-amber-500 to-amber-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-[#0A2540]">{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Student Enrollments" subtitle="New enrolled students by month">
          <AreaChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="students" stroke="#F5A623" strokeWidth={3} fill="#F5A62333" name="Students" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Applications" subtitle="Public applications by month and type">
          <BarChart data={applicationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#0A2540" name="Students" />
            <Bar dataKey="faculty" fill="#8b5cf6" name="Faculty" />
            <Bar dataKey="schools" fill="#F5A623" name="Schools" />
          </BarChart>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-[#0A2540]">Revenue by School</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Current monthly revenue</p>
          {schoolPerformance.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={schoolPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `₹${Math.round(value / 1000)}K`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => formatRupee(Number(value))} />
                <Bar dataKey="revenue" fill="#0A2540" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyData />}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-[#0A2540]">Fee Collection Status</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">Current student records</p>
          {students.length ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={feeStatusData} innerRadius={50} outerRadius={75} dataKey="value">
                    {feeStatusData.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {feeStatusData.map((item, index) => (
                <div key={item.name} className="flex justify-between py-1 text-sm">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    {item.name}
                  </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </>
          ) : <EmptyData />}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-[#0A2540]">School Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['School', 'Students', 'Monthly Revenue', 'Faculty Rating'].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schoolPerformance.length ? schoolPerformance.map((school) => (
                <tr key={school.name}>
                  <td className="px-6 py-4 font-semibold">{school.name}</td>
                  <td className="px-6 py-4">{school.students}</td>
                  <td className="px-6 py-4 font-semibold">{formatRupee(school.revenue)}</td>
                  <td className="px-6 py-4">{school.rating ? school.rating.toFixed(1) : 'No ratings'}</td>
                </tr>
              )) : (
                <tr><td colSpan={4}><EmptyData /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactElement }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="font-bold text-[#0A2540]">{title}</h2>
      <p className="text-xs text-slate-500 mt-1 mb-6">{subtitle}</p>
      <ResponsiveContainer width="100%" height={260}>{children}</ResponsiveContainer>
    </div>
  );
}

function EmptyData() {
  return <div className="h-40 flex items-center justify-center text-sm text-slate-400">No database records yet</div>;
}
