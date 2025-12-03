import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Shield, LogOut, Github } from 'lucide-react';

export const Navigation: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
      isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          OllamaChat
        </h1>
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            <MessageSquare size={18} />
            Chat
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            <Shield size={18} />
            Admin
          </NavLink>
          <NavLink to="/widget" className={linkClass}>
            <span className="text-xs border border-slate-300 px-1 rounded">embed</span>
            Widget Preview
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
         <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">
          <Github size={20} />
        </a>
        <NavLink to="/login" className="text-slate-500 hover:text-red-500 flex items-center gap-1 text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </NavLink>
      </div>
    </nav>
  );
};