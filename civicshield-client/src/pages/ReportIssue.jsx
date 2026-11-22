import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Camera, MapPin, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

function LocationMarker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function ReportIssue() {
  const [position, setPosition] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road');
  const [severity, setSeverity] = useState('Medium');
  const [image, setImage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For testing, we force the same location if no position is clicked
    const latToSend = position ? position.lat : 12.9716;
    const lngToSend = position ? position.lng : 77.5946;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('severity', severity);
    formData.append('lat', latToSend);
    formData.append('lng', lngToSend);
    if (image) formData.append('image', image);

    try {
      const response = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Check if the backend found a duplicate
      if (response.data.isDuplicate) {
        setDuplicateWarning(true);
        setTimeout(() => setDuplicateWarning(false), 6000);
      } else {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
      
      setError('');
      setTitle('');
      setPosition(null);
      setImage(null);
      
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("Failed to submit. Make sure backend is running.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Report an Issue</h2>
        <p className="text-slate-500 mt-1">Help us improve the city by reporting infrastructure problems.</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 border border-emerald-200 animate-fade-in-up">
          <CheckCircle2 size={24} />
          <p className="font-medium">Report submitted successfully!</p>
        </div>
      )}

      {duplicateWarning && (
        <div className="mb-6 bg-orange-50 text-orange-700 p-4 rounded-2xl flex items-center gap-3 border border-orange-200 animate-fade-in-up">
          <ShieldAlert size={24} />
          <div>
            <p className="font-bold">Potential Duplicate Detected!</p>
            <p className="text-sm">A similar issue was already reported within 50 meters of this location. Your report is saved, but the city may merge it.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 border border-red-200">
          <AlertTriangle size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Issue Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Large pothole near main road" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option value="Road">Road Damage</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Electrical">Streetlight</option>
                  <option value="Water">Water Leakage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Camera size={32} className="mb-2 text-blue-500" />
                <span className="text-sm font-medium">{image ? image.name : "Click to upload an image"}</span>
                <span className="text-xs mt-1">JPG, PNG up to 5MB</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">Submit Report</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-red-500" />
            <h3 className="text-lg font-bold text-slate-800">Select Location</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Click anywhere on the map to drop a pin.</p>
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 min-h-[300px]">
            <MapContainer center={[12.9716, 77.5946]} zoom={13} scrollWheelZoom={true}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          {position && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm font-medium flex items-center gap-2">
              <AlertTriangle size={16} />
              Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}