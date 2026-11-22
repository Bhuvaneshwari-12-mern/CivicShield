import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Filter, Loader2 } from 'lucide-react';
import api from '../services/api'; // Make sure this path is correct

export default function MapView() {
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from MongoDB via backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter reports based on dropdown
  const filteredReports = reports.filter(report => 
    filter === 'All' || report.category === filter
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live Infrastructure Map</h2>
          <p className="text-sm text-slate-500 mt-1">View and track reported issues across the city.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Road">Road Damage</option>
            <option value="Electrical">Streetlights</option>
            <option value="Water">Water Issues</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <MapContainer center={[12.9716, 77.5946]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredReports.map((report) => (
              // MongoDB stores [lng, lat], Leaflet needs [lat, lng]
              <Marker 
                key={report._id} 
                position={[report.location.coordinates[1], report.location.coordinates[0]]}
              >
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert size={16} className={
                        report.severity === 'Critical' ? 'text-red-500' : 
                        report.severity === 'High' ? 'text-orange-500' : 'text-yellow-500'
                      } />
                      <span className="font-bold text-slate-800">{report.title}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{report.category}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        report.status === 'Pending' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}