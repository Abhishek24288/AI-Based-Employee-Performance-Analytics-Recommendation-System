import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Fallback metadata
  const userName = user?.name || 'Abhishek Guruji';
  const userRole = user?.role === 'hr' ? 'HR / Administrator' : 'Staff / Employee';
  
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-850 px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand slogan */}
      <div className="flex items-center gap-2">
        <Shield className="h-4.5 w-4.5 text-brand-500 animate-pulse" />
        <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
          Guruji Operations System
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Alerts bell */}
        <button className="relative p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-brand-500 rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-800" />

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-brand-600 to-indigo-500 h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-extrabold text-slate-200 leading-tight">{userName}</p>
            <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">{userRole}</p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800" />

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center justify-center p-2.5 rounded-xl bg-slate-850 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
