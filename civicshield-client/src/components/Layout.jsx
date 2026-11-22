import { NavLink, Outlet } from 'react-router-dom';
import { Map, PlusCircle, User, Bell, LayoutDashboard, ShieldAlert, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Map', path: '/map', icon: Map },
    { name: 'Report Issue', path: '/report', icon: PlusCircle },
    { name: 'My Reports', path: '/my-reports', icon: FileText }, // <-- Added
    { name: 'Admin Panel', path: '/admin', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Premium Navy Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-blue-500/30">
            C
          </div>
          <span className="text-white font-bold text-lg tracking-wide">CivicShield</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name}
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 translate-x-1' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="text-slate-400" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Citizen'}</p>
              <p className="text-xs text-blue-400">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">City Infrastructure Monitor</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}