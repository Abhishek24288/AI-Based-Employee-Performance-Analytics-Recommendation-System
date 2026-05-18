import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../context/EmployeeContext';
import { UserPlus, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';

const AddEmployee = () => {
  const { addEmployee } = useContext(EmployeeContext);
  const navigate = useNavigate();

  // Form State
  const [employeeId, setEmployeeId] = useState('EMP-' + Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [experience, setExperience] = useState('');
  const [performanceScore, setPerformanceScore] = useState(80);
  const [skillsInput, setSkillsInput] = useState('');
  
  // Projects State
  const [projectName1, setProjectName1] = useState('');
  const [projectScore1, setProjectScore1] = useState(80);
  const [projectRole1, setProjectRole1] = useState('Contributor');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !experience) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    // Process skills
    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Process projects
    const projectsArray = [];
    if (projectName1) {
      projectsArray.push({
        name: projectName1,
        score: Number(projectScore1) || 80,
        role: projectRole1
      });
    }

    setLoading(true);
    try {
      await addEmployee({
        employeeId,
        name,
        email,
        department,
        skills: skillsArray,
        experience: Number(experience),
        performanceScore: Number(performanceScore),
        projects: projectsArray
      });

      // Clear form & Redirect
      navigate('/employees');
    } catch (err) {
      setError(err.message || 'Failed to register new employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <UserPlus className="h-8 w-8 text-brand-500" /> Enlist New Employee
        </h2>
        <p className="text-slate-400 mt-1">Register a staff member, input operational metrics, and auto-provision login access.</p>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-350 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Core Profile Data */}
        <div className="glow-card border border-slate-850 rounded-3xl p-6 lg:col-span-2 space-y-6 bg-slate-900/30">
          <h3 className="font-extrabold text-slate-200 border-b border-slate-850 pb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-400" /> Operational Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Registry ID *</label>
              <input
                type="text"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                required
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                placeholder="Priya Patel"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Email Address *</label>
              <input
                type="email"
                placeholder="priya@company.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-350 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenure / Experience (Years) *</label>
              <input
                type="number"
                min="0"
                max="30"
                placeholder="3"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            {/* Performance Score */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Rating Score</label>
                <span className="text-xs font-bold text-brand-450">{performanceScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={performanceScore}
                onChange={e => setPerformanceScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-955 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none mt-2"
              />
            </div>
          </div>

          {/* Skill Tag list */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills Expertise (Comma-Separated)</label>
            <textarea
              rows="2"
              placeholder="React, Swift, AWS Cloud, Kubernetes, Project Architecture"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              className="bg-slate-955 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Separating tags with commas constructs visual dashboard badges automatically.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer pt-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirm Seeding & Onboard <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Project details card (Optional) */}
        <div className="glow-card border border-slate-850 rounded-3xl p-6 space-y-6 bg-slate-900/30">
          <h3 className="font-extrabold text-slate-200 border-b border-slate-850 pb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-brand-450" /> Initial Project
          </h3>

          <div className="flex flex-col gap-4">
            {/* Project Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
              <input
                type="text"
                placeholder="e.g. Cloud Migrator"
                value={projectName1}
                onChange={e => setProjectName1(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Project Role */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Executed</label>
              <input
                type="text"
                placeholder="e.g. Technical Contributor"
                value={projectRole1}
                onChange={e => setProjectRole1(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Project Score */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Evaluation Rating</label>
                <span className="text-xs font-bold text-indigo-400">{projectScore1}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={projectScore1}
                onChange={e => setProjectScore1(Number(e.target.value))}
                className="w-full h-2 bg-slate-955 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none mt-2"
              />
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 text-slate-500 text-[11px] leading-relaxed">
            <strong className="text-slate-450 block mb-1">🔑 Access Provisioning Notification:</strong>
            Adding an employee with a corporate email automatically schedules an account credentials lock with the default password: <code className="text-brand-350 font-bold bg-slate-850 px-1 rounded">Password123</code>.
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
