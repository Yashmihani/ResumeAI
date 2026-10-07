import React from 'react';
import { Link } from 'react-router-dom';
import { Database, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title = 'ResumeAI', subtitle = 'Resume Screening and Job Matching System' }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* System & DB Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border border-slate-200 text-xs font-medium text-slate-700">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>System: <strong className="text-emerald-700">FastAPI + SQLite</strong></span>
        </div>

        {/* Quick New Analysis Action */}
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Analyze Job</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
