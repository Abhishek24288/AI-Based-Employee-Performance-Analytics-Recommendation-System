import React, { useContext, useState } from 'react';
import { CandidateContext } from '../context/CandidateContext';
import CandidateCard from '../components/CandidateCard';
import { Search, Filter, RefreshCw, X } from 'lucide-react';

const CandidateList = () => {
  const { candidates, loading, deleteCandidate, fetchCandidates } = useContext(CandidateContext);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [minExp, setMinExp] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState('');

  // Extract all unique skills across all candidates for filter drop down safely
  const allSkills = Array.from(
    new Set(candidates.flatMap(c => (c.skills || []).map(s => s?.trim())))
  ).filter(Boolean).sort();

  const handleResetFilters = () => {
    setSearch('');
    setMinExp(0);
    setSelectedSkill('');
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
                          (c.bio || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesExp = (c.experience || 0) >= minExp;
    
    const matchesSkill = selectedSkill === '' || 
                         (c.skills || []).some(skill => (skill || '').toLowerCase() === selectedSkill.toLowerCase());

    return matchesSearch && matchesExp && matchesSkill;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Talent Pool</h2>
          <p className="text-slate-400 mt-1">Browse and filter registered candidates.</p>
        </div>
        <button 
          onClick={fetchCandidates}
          className="flex items-center gap-2 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Pool
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glow-card border border-slate-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search</label>
          <div className="flex items-center gap-2.5 bg-slate-850/80 border border-slate-800 rounded-xl px-3.5 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Name, email, bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Skill Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Tag</label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-slate-850/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All Skills</option>
            {allSkills.map((skill, idx) => (
              <option key={idx} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Experience Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Experience</label>
            <span className="text-xs font-bold text-brand-400">{minExp} Years</span>
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

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all text-sm font-medium"
          >
            <X className="h-4 w-4" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(c => (
            <CandidateCard
              key={c._id}
              candidate={c}
              onDelete={deleteCandidate}
            />
          ))}
        </div>
      ) : (
        <div className="glow-card border border-slate-850 rounded-2xl p-16 text-center">
          <Filter className="h-10 w-10 text-slate-500 mx-auto mb-4" />
          <h4 className="text-slate-300 font-bold text-lg">No candidates found</h4>
          <p className="text-slate-500 text-sm mt-1">Try tweaking your search terms or filters.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
