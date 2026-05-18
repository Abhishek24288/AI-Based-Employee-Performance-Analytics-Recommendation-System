import React, { useState } from 'react';
import axios from 'axios';
import { Cpu, Search, Sparkles, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const JobMatching = () => {
  const [requiredInput, setRequiredInput] = useState('');
  const [preferredInput, setPreferredInput] = useState('');
  const [minExperience, setMinExperience] = useState(2);
  
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [matchedResults, setMatchedResults] = useState(null);
  const [error, setError] = useState('');

  const handleRequiredAdd = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const val = requiredInput.trim();
      if (val && !requiredSkills.includes(val)) {
        setRequiredSkills(prev => [...prev, val]);
      }
      setRequiredInput('');
    }
  };

  const handlePreferredAdd = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const val = preferredInput.trim();
      if (val && !preferredSkills.includes(val)) {
        setPreferredSkills(prev => [...prev, val]);
      }
      setPreferredInput('');
    }
  };

  const removeRequired = (skill) => setRequiredSkills(prev => prev.filter(s => s !== skill));
  const removePreferred = (skill) => setPreferredSkills(prev => prev.filter(s => s !== skill));

  const handleMatch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (requiredSkills.length === 0) {
      setError('Please add at least one required skill tag.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://ai-based-employee-performance-analytics-72ye.onrender.com/api/match', {
        requiredSkills,
        preferredSkills,
        minExperience
      });
      setMatchedResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to match candidates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <Cpu className="h-8 w-8 text-brand-500 animate-spin" style={{ animationDuration: '3s' }} /> Skill Matcher Engine
        </h2>
        <p className="text-slate-400 mt-1">Specify job requirements to rank the candidate pool using exact overlap logic.</p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Requirements Form */}
        <div className="glow-card border border-slate-800 rounded-3xl p-6 lg:col-span-1 space-y-6">
          <h3 className="font-bold text-slate-200 text-base border-b border-slate-800 pb-3">Requirements Panel</h3>

          {/* Required Skills */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills *</label>
            <input
              type="text"
              placeholder="Type & press Enter..."
              value={requiredInput}
              onChange={e => setRequiredInput(e.target.value)}
              onKeyDown={handleRequiredAdd}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
            />
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {requiredSkills.map((s, i) => (
                  <span key={i} className="bg-brand-950/40 text-brand-300 border border-brand-900/30 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                    {s} <button type="button" onClick={() => removeRequired(s)} className="hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skills */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Skills</label>
            <input
              type="text"
              placeholder="Type & press Enter..."
              value={preferredInput}
              onChange={e => setPreferredInput(e.target.value)}
              onKeyDown={handlePreferredAdd}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
            />
            {preferredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {preferredSkills.map((s, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                    {s} <button type="button" onClick={() => removePreferred(s)} className="hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Min Experience</label>
              <span className="text-xs font-bold text-brand-400">{minExperience} Years</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={minExperience}
              onChange={e => setMinExperience(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none mt-2"
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/10 transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Run Matcher Engine'
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {matchedResults === null ? (
            <div className="glow-card border border-slate-850 rounded-3xl p-16 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <Search className="h-10 w-10 text-slate-650 mb-4 animate-bounce" />
              <h4 className="text-slate-400 font-bold text-lg">Awaiting Execution</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">Enter the criteria on the left and start matching profiles to see detailed rankings.</p>
            </div>
          ) : matchedResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 text-base px-2">Ranked Shortlist ({matchedResults.length})</h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {matchedResults.map((result, idx) => {
                  const categoryColors = {
                    'High Match': 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30',
                    'Medium Match': 'bg-amber-950/40 text-amber-400 border-amber-900/30',
                    'Low Match': 'bg-rose-950/40 text-rose-400 border-rose-900/30'
                  };

                  return (
                    <div key={idx} className="glow-card border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-bold text-slate-200 text-base">{result.candidate.name}</h4>
                          <span className={`px-2.5 py-0.5 border text-[10px] font-extrabold rounded-full uppercase tracking-wider ${categoryColors[result.matchCategory]}`}>
                            {result.matchCategory}
                          </span>
                          {!result.meetsExperience && (
                            <span className="bg-red-950/40 text-red-400 border border-red-900/30 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Exp Shortfall
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{result.candidate.bio}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Matched Skills */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Matched Skills
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.matchedSkills.length > 0 ? result.matchedSkills.map((s, i) => (
                                <span key={i} className="bg-emerald-950/20 text-emerald-300 border border-emerald-900/20 text-[10px] px-2 py-0.5 rounded-md font-semibold">{s}</span>
                              )) : <span className="text-xs text-slate-600 font-medium">None</span>}
                            </div>
                          </div>

                          {/* Missing Skills */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                              <XCircle className="h-3.5 w-3.5 text-red-500" /> Missing Skills
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.missingSkills.length > 0 ? result.missingSkills.map((s, i) => (
                                <span key={i} className="bg-red-950/20 text-red-300 border border-red-900/20 text-[10px] px-2 py-0.5 rounded-md font-semibold">{s}</span>
                              )) : <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">Fully satisfied!</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Chart Circle */}
                      <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[100px] h-full">
                        <span className="text-2xl font-black text-slate-100">{result.matchScore}%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-1">Match Score</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glow-card border border-slate-850 rounded-3xl p-16 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <AlertCircle className="h-10 w-10 text-red-500/80 mb-4" />
              <h4 className="text-slate-300 font-bold text-lg">No matches found</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">No registered candidates satisfied the mandatory required skill list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatching;
