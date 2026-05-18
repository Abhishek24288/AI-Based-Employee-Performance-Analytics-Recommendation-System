import React, { useState, useContext } from 'react';
import { AIContext } from '../context/AIContext';
import { EmployeeContext } from '../context/EmployeeContext';
import { Sparkles, BrainCircuit, Play, CheckCircle, Save, Trash2, Printer, ChevronRight } from 'lucide-react';

const AIRecommendations = () => {
  const { employees } = useContext(EmployeeContext);
  const {
    aiReport,
    aiLoading,
    aiError,
    getAIRecommendation,
    saveReport,
    deleteReport,
    savedReports,
    clearActiveReport,
    setAiError
  } = useContext(AIContext);

  const [department, setDepartment] = useState('');
  const [focusArea, setFocusArea] = useState('Promotion and Growth Potential');

  // Trigger collective audit
  const handleTriggerAudit = async (e) => {
    e.preventDefault();
    setAiError(null);

    try {
      await getAIRecommendation({
        department,
        focusArea
      });
    } catch (err) {
      // Handled in Context
    }
  };

  const handleSaveReport = () => {
    if (!aiReport) return;
    saveReport({
      ...aiReport,
      metaDept: department || 'All Departments',
      metaFocus: focusArea
    });
    alert('AI Talent Audit saved successfully to your Admin workspace log!');
  };

  const handlePrint = () => {
    window.print();
  };

  // Get active departments
  const uniqueDepts = Array.from(new Set(employees.map(e => e.department))).filter(Boolean);

  return (
    <div className="space-y-8 font-sans print:bg-slate-950 print:text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-8 w-8 text-brand-450 animate-pulse" /> AI Talent Audit Core
          </h2>
          <p className="text-slate-400 mt-1">Leverage OpenRouter intelligence to review organizational promotions, training gaps, and coaching pipelines.</p>
        </div>

        {aiReport && (
          <div className="flex gap-2">
            <button
              onClick={handleSaveReport}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all text-xs font-bold cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Report
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-950/20 border border-brand-900/30 text-brand-400 hover:text-white rounded-xl transition-all text-xs font-bold cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Export Report (Print)
            </button>
          </div>
        )}
      </div>

      {aiError && (
        <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-300 text-xs print:hidden">
          {aiError}
        </div>
      )}

      {/* Settings & Reports splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Control Panel */}
        <div className="glow-card border border-slate-850 rounded-3xl p-6 space-y-6 bg-slate-900/30 print:hidden">
          <h3 className="font-extrabold text-slate-200 border-b border-slate-850 pb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-brand-500" /> Auditor Parameters
          </h3>

          <form onSubmit={handleTriggerAudit} className="space-y-5">
            {/* Dept Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-350 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer w-full"
              >
                <option value="">All Departments</option>
                {uniqueDepts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Audit Focus Area */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Evaluation Metric</label>
              <select
                value={focusArea}
                onChange={e => setFocusArea(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-350 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer w-full"
              >
                <option value="Promotion and Growth Potential">Promotion and Growth Potential</option>
                <option value="Technical Skills Gaps & Architect Training">Technical Skills Gaps & Training</option>
                <option value="Gamified badges reward feasibility">Gamified Badges Awarding</option>
                <option value="High-Throughput Project Readiness">Project Execution Fitness</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {aiLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Launch Neural Audit <Play className="h-4 w-4 fill-white" />
                </>
              )}
            </button>
          </form>

          {/* Saved reports tracker inside sidebar */}
          {savedReports.length > 0 && (
            <div className="pt-4 border-t border-slate-850 space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Admin Report Logs ({savedReports.length})</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedReports.map((rep) => (
                  <div key={rep.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between group hover:border-brand-900/40">
                    <div className="cursor-pointer flex-1" onClick={() => clearActiveReport() || getAIRecommendation({ department: rep.metaDept, focusArea: rep.metaFocus })}>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">{rep.metaFocus}</span>
                      <span className="text-[9px] text-slate-650 block mt-0.5">{rep.metaDept} • {new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => deleteReport(rep.id)}
                      className="p-1 hover:bg-slate-850 border border-transparent hover:border-slate-850 rounded text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Dashboard Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {aiLoading ? (
            <div className="glow-card border border-slate-850 rounded-3xl p-16 text-center min-h-[450px] flex flex-col items-center justify-center bg-slate-900/20">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
                <BrainCircuit className="h-16 w-16 text-brand-400 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <h4 className="text-slate-200 font-bold text-lg animate-pulse">Computing Collective Promotion Telemetry...</h4>
              <p className="text-slate-500 text-sm mt-2 max-w-sm">
                OpenRouter AI Agent is evaluating experience metrics, department divisions, projects histories, and performance scores. This takes about 5-8 seconds.
              </p>
            </div>
          ) : aiReport === null ? (
            <div className="glow-card border border-slate-850 rounded-3xl p-16 text-center min-h-[450px] flex flex-col items-center justify-center bg-slate-900/20 print:hidden">
              <BrainCircuit className="h-12 w-12 text-slate-700 mb-4" />
              <h4 className="text-slate-400 font-bold text-lg">Talent Audit Standby</h4>
              <p className="text-slate-550 text-sm mt-1 max-w-md">
                Select your target auditing filters on the left and trigger the evaluation to construct a detailed collective promotion suitability matrix.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="glow-card border border-brand-900/30 rounded-3xl p-6 bg-gradient-to-tr from-brand-950/15 via-slate-900/30 to-purple-950/15 glow-indigo">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-brand-400" /> Executive Talent Audit Summary
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">{aiReport.summary}</p>
              </div>

              {/* Ranking Grid */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-slate-200 text-base px-2">Audited Promotion Matrix</h3>
                <div className="space-y-4">
                  {aiReport.ranking && aiReport.ranking.map((profile, i) => (
                    <div key={i} className="glow-card border border-slate-850 rounded-2xl p-5 space-y-4 bg-slate-900/30">
                      {/* Top Row */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-brand-950/60 border border-brand-900/50 rounded-lg flex items-center justify-center font-black text-brand-400 text-sm">
                            {profile.rank || i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-200">{profile.name}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Employee ID: {profile.employeeId}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                            profile.growthPotential === 'High' || profile.growthPotential === 'Exceptional'
                              ? 'bg-emerald-950/30 border border-emerald-900/30 text-emerald-400'
                              : 'bg-slate-950 border border-slate-850 text-slate-400'
                          }`}>
                            {profile.growthPotential || 'High'} Potential
                          </span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-brand-500 pl-3.5">
                        {profile.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
