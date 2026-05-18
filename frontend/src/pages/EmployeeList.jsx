import React, { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import { Link } from 'react-router-dom';
import { Search, Filter, RefreshCw, X, Award, Briefcase, Trash2, ArrowRight } from 'lucide-react';

const EmployeeList = () => {
  const { employees, loading, deleteEmployee, fetchEmployees, searchEmployees } = useContext(EmployeeContext);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [minExp, setMinExp] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Extract all unique departments for filter dropdown
  const allDepts = Array.from(
    new Set(employees.map(e => e.department?.trim()))
  ).filter(Boolean).sort();

  const handleResetFilters = () => {
    setSearch('');
    setMinExp(0);
    setMinScore(0);
    setSelectedDept('');
    fetchEmployees();
  };

  const handleApplyFilters = () => {
    searchEmployees({
      department: selectedDept,
      experience: minExp,
      performanceScore: minScore
    });
  };

  // Safe client-side search overlaying the active lists
  const filteredEmployees = employees.filter(e => {
    const matchesSearch =
      (e.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.employeeId || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesExp = (e.experience || 0) >= minExp;
    const matchesScore = (e.performanceScore || 0) >= minScore;
    const matchesDept = selectedDept === '' || (e.department || '').toLowerCase() === selectedDept.toLowerCase();

    return matchesSearch && matchesExp && matchesScore && matchesDept;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to remove ${name} from organizational database? This also removes their login credentials.`)) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        alert(err.message || 'Failed to remove employee.');
      }
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Personnel Directory</h2>
          <p className="text-slate-400 mt-1">Browse, filter, and audit active employee performance scores.</p>
        </div>
        <button 
          onClick={fetchEmployees}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 text-slate-300 rounded-xl transition-colors text-sm cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Directory
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glow-card border border-slate-850 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 bg-slate-900/30">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keywords</label>
          <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder:text-slate-650"
            />
          </div>
        </div>

        {/* Dept Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-slate-300 text-sm focus:outline-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {allDepts.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Experience Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Experience</label>
            <span className="text-xs font-bold text-brand-450">{minExp} Yrs</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={minExp}
            onChange={(e) => setMinExp(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none mt-2"
          />
        </div>

        {/* Rating Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Score Rating</label>
            <span className="text-xs font-bold text-brand-450">{minScore}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none mt-2"
          />
        </div>

        {/* Reset / Search Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleApplyFilters}
            className="w-2/3 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all text-xs cursor-pointer shadow-md shadow-brand-500/5"
          >
            Apply Query
          </button>
          <button
            onClick={handleResetFilters}
            className="w-1/3 flex items-center justify-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
            title="Reset Filters"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/10 animate-pulse h-60" />
          ))}
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(e => (
            <div key={e._id} className="glow-card border border-slate-850 rounded-3xl p-6 flex flex-col justify-between h-full bg-slate-900/30 group hover:border-brand-900/40 relative overflow-hidden">
              
              {/* Rating Background Glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[45px] opacity-15 pointer-events-none -translate-y-6 translate-x-6 ${
                e.performanceScore >= 90 ? 'bg-emerald-500' : e.performanceScore >= 75 ? 'bg-indigo-500' : 'bg-rose-500'
              }`} />

              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-extrabold text-slate-100 group-hover:text-brand-350 transition-colors text-base">{e.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{e.employeeId} • {e.department}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-black block ${
                      e.performanceScore >= 90 ? 'text-emerald-400' : e.performanceScore >= 75 ? 'text-brand-350' : 'text-rose-450'
                    }`}>{e.performanceScore}%</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Rating</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-1 bg-slate-950 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full rounded-full ${
                    e.performanceScore >= 90 ? 'bg-emerald-500' : e.performanceScore >= 75 ? 'bg-brand-500' : 'bg-rose-500'
                  }`} style={{ width: `${e.performanceScore}%` }} />
                </div>

                {/* Skills tags */}
                {e.skills && e.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {e.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="bg-slate-950/80 text-slate-400 border border-slate-850 px-2 py-0.5 rounded text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                    {e.skills.length > 4 && (
                      <span className="text-[10px] text-slate-500 font-bold pl-1">+{e.skills.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer details */}
              <div className="mt-6 pt-4 border-t border-slate-850 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-550" /> {e.experience} Yrs Exp
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-slate-550" /> Rank #{e.ranking || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(e._id, e.name)}
                    className="p-2 bg-slate-950 hover:bg-red-950/30 border border-slate-850 hover:border-red-900/50 text-slate-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                    title="Remove Profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/employees/${e._id}`}
                    className="flex items-center gap-1 text-xs text-brand-350 hover:text-white font-bold bg-brand-950/20 border border-brand-900/20 hover:bg-brand-650 px-3 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    Dossier <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glow-card border border-slate-850 rounded-2xl p-16 text-center bg-slate-900/20">
          <Filter className="h-10 w-10 text-slate-650 mx-auto mb-4" />
          <h4 className="text-slate-350 font-bold text-lg">No staff records found</h4>
          <p className="text-slate-500 text-sm mt-1">Adjust your search parameters or reset the directory filter.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
