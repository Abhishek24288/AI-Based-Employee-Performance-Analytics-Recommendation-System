import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, Sparkles, BrainCircuit, Briefcase, UserCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['hr', 'employee'] },
    { name: 'Personnel Directory', path: '/employees', icon: Users, roles: ['hr'] },
    { name: 'Onboard Staff', path: '/add-employee', icon: UserPlus, roles: ['hr'] },
    { name: 'Talent Pool', path: '/candidates', icon: UserCheck, roles: ['hr'] },
    { name: 'Register Candidate', path: '/add-candidate', icon: UserPlus, roles: ['hr'] },
    { name: 'Skill Matcher', path: '/job-matching', icon: BrainCircuit, roles: ['hr'] },
    { name: 'AI recommendations', path: '/ai-recommendations', icon: Sparkles, roles: ['hr'] },
  ];

  const allowedMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-850 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      <div className="p-6 flex items-center gap-3 border-b border-slate-850">
        <div className="bg-gradient-to-tr from-brand-600 to-indigo-400 p-2.5 rounded-xl shadow-lg shadow-brand-500/20">
          <BrainCircuit className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent leading-none">
            GURUJI AI
          </h1>
          <span className="text-[10px] text-brand-400 font-bold tracking-widest uppercase">
            Employee Suite
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-500/10'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-850">
        <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">OpenRouter Active</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Performance analytics are audited with precise, secure neural engines.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
