import React, { useState, useContext } from 'react';
import { CandidateContext } from '../context/CandidateContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles, X, Plus } from 'lucide-react';

const AddCandidate = () => {
  const { addCandidate } = useContext(CandidateContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: 0,
    bio: '',
    resumeUrl: ''
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setSkills((prev) => [...prev, cleanSkill]);
    }
    setSkillInput('');
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills((prev) => prev.filter(s => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name || !formData.email) {
      setFormError('Name and Email are required fields.');
      return;
    }

    if (skills.length === 0) {
      setFormError('Please add at least one skill.');
      return;
    }

    setLoading(true);

    try {
      await addCandidate({
        ...formData,
        skills
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/candidates');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to submit candidate profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-brand-500" /> Register Candidate
        </h2>
        <p className="text-slate-400 mt-1">Create a new talent profile for skill matching & AI routing.</p>
      </div>

      {success && (
        <div className="bg-emerald-950/40 border border-emerald-900/50 p-4 rounded-xl text-emerald-300 text-sm flex items-center gap-3 animate-bounce">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <span>Profile created successfully! Redirecting to pool...</span>
        </div>
      )}

      {formError && (
        <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-300 text-sm">
          {formError}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glow-card border border-slate-800 rounded-3xl p-8 space-y-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
          />
        </div>

        {/* Email & Experience Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years of Experience</label>
            <input
              type="number"
              name="experience"
              min="0"
              max="40"
              value={formData.experience}
              onChange={handleInputChange}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full"
            />
          </div>
        </div>

        {/* Skills Tagging */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills & Expertise *</label>
          <p className="text-[11px] text-slate-500 leading-tight">Press enter or comma to register a skill tag.</p>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-colors flex items-center justify-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Render Skills Tag cloud */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 bg-slate-900/50 p-4 rounded-xl border border-slate-850">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-brand-950/40 border border-brand-900/40 text-brand-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="text-brand-400 hover:text-brand-200 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Biography / Pitch */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Bio</label>
          <textarea
            name="bio"
            rows="4"
            placeholder="Tell us about projects, achievements, and key experience..."
            value={formData.bio}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650 resize-none"
          />
        </div>

        {/* Resume URL */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Link (Optional)</label>
          <input
            type="url"
            name="resumeUrl"
            placeholder="https://linkedin.com/in/username or google drive url"
            value={formData.resumeUrl}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-full placeholder:text-slate-650"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Register Profile'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCandidate;
