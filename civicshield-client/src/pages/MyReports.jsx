import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  if (loading) return <div className="p-8 text-center text-blue-600">Loading your reports...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Reports</h2>
        <p className="text-slate-500 mt-1">Track the status of the issues you have reported.</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">You haven't reported any issues yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report._id} className={`bg-white p-6 rounded-2xl shadow-sm border ${report.status === 'Resolved' ? 'border-emerald-200' : 'border-slate-200'}`}>
              
              {/* Appreciation Message if Resolved */}
              {report.status === 'Resolved' && (
                <div className="mb-4 bg-emerald-50 text-emerald-700 p-3 rounded-xl flex items-start gap-2 border border-emerald-100">
                  <CheckCircle2 size={20} className="mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Issue Resolved!</p>
                    <p className="text-xs mt-0.5">Thank you for helping us improve the city! The authorities have fixed this issue.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                  report.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                  report.severity === 'High' ? 'bg-orange-50 text-orange-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {report.severity}
                </span>
              </div>
              
              <p className="text-sm text-slate-500 mb-4">{report.category} • Reported on {new Date(report.createdAt).toLocaleDateString()}</p>
              
              <div className="flex items-center gap-2 text-sm font-medium">
                {report.status === 'Resolved' ? (
                  <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={16}/> Resolved</span>
                ) : report.status === 'In Progress' ? (
                  <span className="text-blue-600 flex items-center gap-1"><Clock size={16}/> In Progress</span>
                ) : (
                  <span className="text-orange-600 flex items-center gap-1"><AlertTriangle size={16}/> Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}