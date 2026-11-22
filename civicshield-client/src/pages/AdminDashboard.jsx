import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/reports/${id}`, { status: newStatus });
      fetchReports(); // Refresh the table
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Resolved') return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Resolved</span>;
    if (status === 'In Progress') return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1"><RefreshCw size={12}/> In Progress</span>;
    return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pending</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Authority Dashboard</h2>
        <p className="text-slate-500 mt-1">Manage and resolve citizen reports.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-blue-600 font-bold animate-pulse">Loading Reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <AlertCircle size={48} className="text-slate-300 mb-4" />
            <p>No reports found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {report.imageUrl ? (
                        <img 
                          src={`http://localhost:5000${report.imageUrl}`} 
                          alt="Report" 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => window.open(`http://localhost:5000${report.imageUrl}`, '_blank')}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{report.title}</p>
                      <p className="text-xs text-slate-400">Lat: {report.location.coordinates[1].toFixed(4)}, Lng: {report.location.coordinates[0].toFixed(4)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{report.category}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        report.severity === 'Critical' ? 'text-red-600 bg-red-50' : 
                        report.severity === 'High' ? 'text-orange-600 bg-orange-50' : 
                        'text-yellow-600 bg-yellow-50'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id, e.target.value)}
                        className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-blue-300"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}