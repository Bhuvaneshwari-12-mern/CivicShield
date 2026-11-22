import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-blue-600 font-bold">Loading Analytics...</div>;

  // Safety check in case there is no data yet
  if (!stats || !stats.categoryStats) {
    return <div className="p-8 text-center text-slate-500">No data available. Please submit a report first.</div>;
  }

  const kpis = [
    { title: 'Total Reports', value: stats.totalReports || 0, icon: FileText, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    { title: 'Pending', value: stats.pending || 0, icon: Clock, color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
    { title: 'Resolved', value: stats.resolved || 0, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
    { title: 'Critical Issues', value: stats.critical || 0, icon: AlertTriangle, color: 'bg-red-100 text-red-600', border: 'border-red-200' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const severityData = stats.severityStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  const categoryData = stats.categoryStats.map(item => ({
    name: item._id,
    reports: item.count
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">City Overview</h2>
        <p className="text-slate-500 mt-1">Real-time statistics of infrastructure reports across the city.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className={`bg-white p-6 rounded-2xl shadow-sm border ${kpi.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{kpi.title}</p>
                  <p className="text-4xl font-black text-slate-800 mt-2">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart: Reports by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Reports by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="reports" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Reports by Severity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Severity Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}