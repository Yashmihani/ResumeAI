import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  ScanText,
  History,
  User,
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resume', path: '/resume', icon: FileText },
    { name: 'Analyze Resume', path: '/analyze', icon: ScanText },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-lg min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
            RA
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">ResumeAI</span>
            <span className="block text-[11px] text-emerald-400 font-medium">Resume Screening and Job Matching System</span>
          </div>
        </div>

        {/* Academic Project Subheading */}
        <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Project Domain</span>
          </div>
          <span className="font-semibold text-slate-200 mt-0.5 block">Natural Language Processing</span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Project Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Candidate Profile / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
        <div className="text-xs">
          <span className="text-slate-400">Logged in candidate:</span>
          <p className="font-bold text-white text-sm truncate">{user?.name || 'Candidate'}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs text-rose-300 hover:text-rose-200 font-semibold pt-1 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
