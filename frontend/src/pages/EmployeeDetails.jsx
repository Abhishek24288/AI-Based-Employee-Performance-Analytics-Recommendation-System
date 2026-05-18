import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EmployeeContext } from '../context/EmployeeContext';
import { AuthContext } from '../context/AuthContext';
import { AIContext } from '../context/AIContext';
import {
  Award,
  Briefcase,
  Sparkles,
  Zap,
  BookOpen,
  CheckCircle,
  FolderKanban,
  Edit3,
  ListTodo,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { selectedEmployee, fetchEmployeeById, updateEmployee, loading } = useContext(EmployeeContext);
  const { getAIRecommendation, aiLoading } = useContext(AIContext);

  const [activeTab, setActiveTab] = useState('scorecard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState('');

  // Editable Form Fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [experience, setExperience] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [skillsInput, setSkillsInput] = useState('');
  
  // Projects editor
  const [projectsList, setProjectsList] = useState([]);
  const [newProjName, setNewProjName] = useState('');
  const [newProjRole, setNewProjRole] = useState('Contributor');
  const [newProjScore, setNewProjScore] = useState(80);

  useEffect(() => {
    fetchEmployeeById(id).catch(() => {
      navigate('/unauthorized'); // Redirect if restricted
    });
  }, [id, fetchEmployeeById, navigate]);

  // Sync edit form fields with selectedEmployee data
  useEffect(() => {
    if (selectedEmployee) {
      setName(selectedEmployee.name || '');
      setDepartment(selectedEmployee.department || 'Engineering');
      setExperience(selectedEmployee.experience || 0);
      setPerformanceScore(selectedEmployee.performanceScore || 80);
      setSkillsInput(selectedEmployee.skills?.join(', ') || '');
      setProjectsList(selectedEmployee.projects || []);
    }
  }, [selectedEmployee]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');

    const processedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      await updateEmployee(selectedEmployee._id, {
        name,
        department,
        experience: Number(experience),
        performanceScore: Number(performanceScore),
        skills: processedSkills,
        projects: projectsList
      });
      setShowEditModal(false);
    } catch (err) {
      setEditError(err.message || 'Failed to save changes.');
    }
  };

  const handleTriggerAI = async () => {
    try {
      await getAIRecommendation({
        employeeId: selectedEmployee._id,
        focusArea: "Strategic Promotion and Skill Integration Analysis"
      });
      // Re-fetch employee data to show updated AI fields in UI
      fetchEmployeeById(id);
    } catch (err) {
      alert(err.message || 'Failed to trigger OpenRouter analysis.');
    }
  };

  const handleAddProject = () => {
    if (!newProjName) return;
    const updated = [
      ...projectsList,
      { name: newProjName, role: newProjRole, score: Number(newProjScore) || 80 }
    ];
    setProjectsList(updated);
    setNewProjName('');
  };

  const handleRemoveProject = (idx) => {
    const updated = projectsList.filter((_, i) => i !== idx);
    setProjectsList(updated);
  };

  if (loading || !selectedEmployee) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
        <p className="text-slate-500 text-sm">Opening dossier lock...</p>
      </div>
    );
  }

  // Gauge details
  const radialData = [
    {
      name: 'Performance',
      value: selectedEmployee.performanceScore || 0,
      fill: '#6366f1'
    }
  ];

  const mockBadges = [
    { name: 'Star Performer', reason: 'Consistently holds score > 90%', color: 'border-yellow-900/30 bg-yellow-950/20 text-yellow-400' },
    { name: 'Problem Solver', reason: 'Successfully launched complex migration engine', color: 'border-indigo-900/30 bg-indigo-950/20 text-indigo-400' },
    { name: 'Agile Maverick', reason: 'Finished 5 consecutive high-priority sprints', color: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-450' }
  ];

  const mockLogs = [
    { text: 'Completed React performance dashboard integration', date: '3 days ago' },
    { text: 'Launched high-throughput telemetry API servers', date: '1 week ago' },
    { text: 'Enrolled in corporate AWS architect coaching seminars', date: '2 weeks ago' }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Details Header */}
      <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-500/10">
            {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">{selectedEmployee.name}</h2>
            <p className="text-sm text-slate-500">{selectedEmployee.email} • {selectedEmployee.department} Team</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-slate-200 rounded-xl transition-all font-bold text-xs cursor-pointer"
          >
            <Edit3 className="h-4 w-4" /> Edit Operational Info
          </button>
          
          {user.role === 'hr' && (
            <button
              onClick={handleTriggerAI}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-brand-500/10 transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" /> Neural Performance Audit
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850 gap-6">
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'scorecard' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Performance Scorecard
          {activeTab === 'scorecard' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'roadmap' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          AI Growth Roadmap & Suggestions
          {activeTab === 'roadmap' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('gamified')}
          className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
            activeTab === 'gamified' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Activity Logs & Gamified Badges
          {activeTab === 'gamified' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* Tab 1: Scorecard */}
        {activeTab === 'scorecard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 flex flex-col items-center text-center">
              <h3 className="font-extrabold text-slate-300 text-xs uppercase tracking-wider mb-2">Performance Quotient</h3>
              <div className="relative h-44 w-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={12}
                    data={radialData}
                    startAngle={225}
                    endAngle={-45}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar background clockWise dataKey="value" cornerRadius={6} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-100">{selectedEmployee.performanceScore}%</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Excellent Rating</span>
                </div>
              </div>
              
              <div className="w-full mt-4 space-y-3.5 border-t border-slate-850/60 pt-4 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Tenure / Service</span>
                  <span className="text-slate-200 font-bold">{selectedEmployee.experience} Years</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Operational Rank</span>
                  <span className="text-slate-200 font-bold">Rank #{selectedEmployee.ranking || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Skills Area */}
              <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 space-y-4">
                <h4 className="font-extrabold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ListTodo className="h-4.5 w-4.5 text-brand-450" /> Endorsed Skill Matrix
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                    selectedEmployee.skills.map((s, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-850 px-3.5 py-1.5 rounded-xl text-slate-300 text-xs font-bold shadow-sm">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">No active technical skills listed.</span>
                  )}
                </div>
              </div>

              {/* Projects List */}
              <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 space-y-4">
                <h4 className="font-extrabold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FolderKanban className="h-4.5 w-4.5 text-brand-450" /> Project Portfolio
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedEmployee.projects && selectedEmployee.projects.length > 0 ? (
                    selectedEmployee.projects.map((proj, idx) => (
                      <div key={idx} className="bg-slate-955 border border-slate-850/80 p-4 rounded-2xl flex justify-between items-center group">
                        <div>
                          <p className="font-bold text-slate-200 text-sm">{proj.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Role: {proj.role || 'Contributor'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-semibold block uppercase">Rating</span>
                          <span className="text-base font-black text-brand-350">{proj.score || 0}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 text-center py-6 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      No projects recorded in operational logs.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {/* Feedback Summary */}
            <div className="glow-card border border-brand-900/30 rounded-3xl p-6 bg-gradient-to-tr from-brand-950/10 via-slate-900/30 to-purple-950/10 glow-indigo space-y-3">
              <div className="flex items-center gap-2 text-brand-400">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <h3 className="font-extrabold text-slate-200">Neural Performance Analysis & Feedback</h3>
              </div>
              {selectedEmployee.aiFeedback ? (
                <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-brand-500 pl-4 py-1">
                  {selectedEmployee.aiFeedback}
                </p>
              ) : (
                <div className="text-center py-8 text-slate-550 border border-dashed border-slate-800 rounded-2xl bg-slate-950/10">
                  <Zap className="h-8 w-8 text-slate-650 mx-auto mb-2" />
                  <p className="text-xs">No active coaching telemetry recorded. Please click "Neural Performance Audit" above to launch an OpenRouter audit.</p>
                </div>
              )}
            </div>

            {/* Training roadmap */}
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 space-y-4">
              <div className="flex items-center gap-2 text-purple-400">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-extrabold text-slate-200">Competency Integration Training Roadmap</h3>
              </div>
              {selectedEmployee.trainingSuggestions ? (
                <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line pl-2">
                  {selectedEmployee.trainingSuggestions}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-550 border border-dashed border-slate-800 rounded-2xl bg-slate-950/10">
                  <BookOpen className="h-8 w-8 text-slate-650 mx-auto mb-2" />
                  <p className="text-xs">No active training roadmap seeded.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Gamified */}
        {activeTab === 'gamified' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Badges */}
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-brand-450 animate-bounce" /> Gamified Performance Badges
              </h3>
              <div className="space-y-4">
                {mockBadges.map((badge, idx) => (
                  <div key={idx} className={`border rounded-2xl p-4 flex items-center gap-4 ${badge.color}`}>
                    <div className="p-3 bg-slate-950/65 rounded-xl border border-white/5 font-black text-xs uppercase tracking-widest shrink-0">
                      Badge
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">{badge.name}</p>
                      <p className="text-[11px] opacity-75 mt-0.5">{badge.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logs */}
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 space-y-4">
              <h3 className="font-extrabold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-brand-450" /> Activity Logs
              </h3>
              <div className="space-y-4 relative pl-3 border-l border-slate-850">
                {mockLogs.map((log, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-brand-500" />
                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">{log.text}</p>
                    <span className="text-[9px] text-slate-500 font-bold block">{log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline Modal/Editor Overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glow-card border border-slate-800 bg-slate-900 max-w-2xl w-full rounded-3xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-lg font-black text-slate-200 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-brand-400" /> Update Operational Telemetry
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-800 border border-transparent hover:border-slate-800 rounded-lg text-slate-500 hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-red-300 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={user.role !== 'hr'}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  />
                </div>

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    disabled={user.role !== 'hr'}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-350 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    disabled={user.role !== 'hr'}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                  />
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Score</label>
                    <span className="text-xs font-bold text-brand-450">{performanceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={performanceScore}
                    disabled={user.role !== 'hr'}
                    onChange={e => setPerformanceScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none mt-2 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Expertise (Comma-Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Projects inline editor */}
              <div className="border-t border-slate-850 pt-4 space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Projects ({projectsList.length})</label>
                
                {/* Projects grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-36 overflow-y-auto pr-1">
                  {projectsList.map((proj, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-850 px-3 py-2 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-300 block">{proj.name}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold">Role: {proj.role} ({proj.score}%)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-red-400 hover:text-red-300 font-black cursor-pointer px-1.5"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new project row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-slate-950/45 p-3 rounded-2xl border border-slate-850">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProjName}
                    onChange={e => setNewProjName(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Dev)"
                    value={newProjRole}
                    onChange={e => setNewProjRole(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 w-full"
                  />
                  <div className="flex gap-2 items-center w-full">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Score (e.g. 90)"
                      value={newProjScore}
                      onChange={e => setNewProjScore(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 w-16"
                    />
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="bg-brand-600 hover:bg-brand-500 text-white rounded-lg p-1.5 cursor-pointer shadow-md shadow-brand-500/10 flex items-center justify-center shrink-0 w-full flex-1"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all text-xs cursor-pointer shadow-md shadow-brand-500/10"
                >
                  Commit Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
