import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { EmployeeContext } from '../context/EmployeeContext';
import { AIContext } from '../context/AIContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Award,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Sparkles,
  BookOpen,
  FolderKanban,
  Zap,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { employees, loading, fetchEmployees, fetchEmployeeById, selectedEmployee } = useContext(EmployeeContext);
  const { getAIRecommendation, aiLoading } = useContext(AIContext);
  const navigate = useNavigate();

  const [empProfile, setEmpProfile] = useState(null);
  const [empLoading, setEmpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');

  // Trigger loading based on role
  useEffect(() => {
    if (user?.role === 'hr') {
      fetchEmployees();
    } else if (user?.role === 'employee') {
      setEmpLoading(true);
      fetchEmployeeById('me')
        .then((res) => {
          setEmpProfile(res);
          setEmpLoading(false);
        })
        .catch(() => {
          setEmpLoading(false);
        });
    }
  }, [user, fetchEmployees, fetchEmployeeById]);

  // HR DASHBOARD PRE-COMPUTATIONS
  const totalEmployees = employees.length;
  
  const avgPerformance = totalEmployees
    ? Math.round(employees.reduce((sum, e) => sum + (e.performanceScore || 0), 0) / totalEmployees)
    : 0;

  // Calculate department staffing and highest department average
  const deptCounts = {};
  const deptScores = {};
  
  employees.forEach((e) => {
    const dept = e.department || 'General';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    deptScores[dept] = (deptScores[dept] || 0) + (e.performanceScore || 0);
  });

  const deptData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    value: deptCounts[dept],
  }));

  let topDept = 'N/A';
  let maxDeptAvg = 0;
  
  Object.keys(deptScores).forEach((dept) => {
    const avg = deptScores[dept] / deptCounts[dept];
    if (avg > maxDeptAvg) {
      maxDeptAvg = avg;
      topDept = dept;
    }
  });

  // Top overall performer
  const sortedByPerf = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);
  const topPerformer = sortedByPerf[0]?.name || 'N/A';
  const topPerformerScore = sortedByPerf[0]?.performanceScore || 0;

  // Recharts Config
  const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f43f5e', '#eab308'];

  const hrStats = [
    { name: 'Total Personnel', value: totalEmployees, sub: 'Active head count', icon: Users, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-900/30' },
    { name: 'Avg. Rating', value: `${avgPerformance}%`, sub: 'Overall staff score', icon: Award, color: 'text-purple-400 bg-purple-950/40 border-purple-900/30' },
    { name: 'Prime Dept', value: topDept, sub: `${Math.round(maxDeptAvg)}% average score`, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30' },
    { name: 'Top Performer', value: topPerformer, sub: `${topPerformerScore}% rating`, icon: Briefcase, color: 'text-rose-400 bg-rose-950/40 border-rose-900/30' },
  ];

  // EMPLOYEE DASHBOARD SELF RECOVERY PRE-COMPUTATIONS
  const activeEmployee = empProfile || selectedEmployee;

  // Radial Bar Data (Performance Rating Gauge)
  const radialData = [
    {
      name: 'Performance',
      value: activeEmployee?.performanceScore || 0,
      fill: '#6366f1'
    }
  ];

  if (loading || empLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
        <p className="text-slate-500 text-sm animate-pulse">Assembling live intelligence telemetry...</p>
      </div>
    );
  }

  // ==============================================
  // 1. HR PORTAL VIEW
  // ==============================================
  if (user?.role === 'hr') {
    return (
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              HR Administration Suite
            </h2>
            <p className="text-slate-400 mt-1">Real-time organizational performance analytics and AI audits.</p>
          </div>
          <Link
            to="/ai-recommendations"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-brand-500/10 font-bold transition-all text-sm cursor-pointer"
          >
            <Sparkles className="h-4.5 w-4.5" /> AI Recommendations
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hrStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glow-card rounded-2xl p-6 flex items-center justify-between border border-slate-850 bg-slate-900/30">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.name}</p>
                  <h4 className="text-2xl font-black text-slate-100 mt-2">{stat.value}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{stat.sub}</span>
                </div>
                <div className={`p-4 rounded-xl border ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Distribution */}
          <div className="glow-card border border-slate-850 rounded-2xl p-6 lg:col-span-2 bg-slate-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-200">Staff Score Leaderboard</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Performance ratings across team members</p>
              </div>
              <span className="text-xs text-brand-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 animate-pulse" /> Live Metrics
              </span>
            </div>

            <div className="h-80 w-full">
              {employees.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employees.slice(0, 10)}>
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Bar dataKey="performanceScore" fill="url(#colorPerf)" radius={[6, 6, 0, 0]}>
                      <defs>
                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0.15}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                  Add staff members to construct performance analytics.
                </div>
              )}
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="glow-card border border-slate-850 rounded-2xl p-6 bg-slate-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-200">Department Split</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Personnel headcount allocation</p>
              </div>
            </div>

            <div className="h-80 flex flex-col items-center justify-center gap-6">
              {employees.length > 0 ? (
                <>
                  <div className="h-44 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deptData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={6}
                          dataKey="value"
                        >
                          {deptData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          itemStyle={{ color: '#f3f4f6' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-100">{totalEmployees}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Personnel</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full mt-2">
                    {deptData.map((data, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{data.name} ({data.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                  Add staff members to construct headcount splits.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Additions List */}
        <div className="glow-card border border-slate-850 rounded-2xl p-6 bg-slate-900/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-200">Recent Employee Additions</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Quick lookup of recently enrolled staff members</p>
            </div>
            <Link to="/employees" className="text-xs text-brand-400 font-bold hover:underline flex items-center gap-1">
              View Directory <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {employees.length > 0 ? (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-4">Staff Details</th>
                    <th className="py-4 px-4">ID</th>
                    <th className="py-4 px-4">Department</th>
                    <th className="py-4 px-4">Experience</th>
                    <th className="py-4 px-4">Score</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {employees.slice(0, 4).map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-900/30 transition-colors group">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-brand-350 transition-colors">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400 text-xs">{emp.employeeId}</td>
                      <td className="py-4 px-4">
                        <span className="bg-slate-850/80 text-slate-350 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-semibold">{emp.experience} Years</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-sm ${
                            emp.performanceScore >= 90 ? 'text-emerald-450' : emp.performanceScore >= 75 ? 'text-brand-350' : 'text-rose-450'
                          }`}>{emp.performanceScore}%</span>
                          <div className="w-16 h-1 bg-slate-850 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              emp.performanceScore >= 90 ? 'bg-emerald-500' : emp.performanceScore >= 75 ? 'bg-brand-500' : 'bg-rose-500'
                            }`} style={{ width: `${emp.performanceScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/employees/${emp._id}`}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-bold bg-slate-850 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Telemetry
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No active employee records available. Enlist staff member profiles to begin tracking.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // 2. EMPLOYEE PORTAL VIEW
  // ==============================================
  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome, {activeEmployee?.name || user?.name}
          </h2>
          <p className="text-slate-400 mt-1">Access your personalized performance scorecards, coaching reviews, and roadmaps.</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-350">Operational Profile Live</span>
        </div>
      </div>

      {activeEmployee ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Gauge */}
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 flex flex-col items-center justify-center text-center">
              <h3 className="font-extrabold text-slate-300 text-sm uppercase tracking-wider mb-2">Performance Quotient</h3>
              
              <div className="relative h-48 w-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={14}
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
                    <RadialBar
                      background
                      clockWise
                      dataKey="value"
                      cornerRadius={8}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-50">{activeEmployee.performanceScore}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Excellent</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 max-w-xs mt-2 italic leading-relaxed">
                "Consistently drives projects to completion with highly responsive technical excellence."
              </p>
            </div>

            {/* Profile Summaries */}
            <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Employee Registry ID</span>
                  <p className="font-mono text-base font-bold text-slate-200 mt-0.5">{activeEmployee.employeeId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assigned Department</span>
                  <p className="text-base font-bold text-slate-200 mt-0.5 uppercase tracking-wide">{activeEmployee.department}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Industry Tenure</span>
                  <p className="text-base font-bold text-slate-200 mt-0.5">{activeEmployee.experience} Years of Service</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400">
                    <FolderKanban className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Portfolios</span>
                  </div>
                  <span className="text-2xl font-black text-slate-200">{activeEmployee.projects?.length || 0}</span>
                  <span className="text-xs text-slate-500 block mt-1">High-impact engineering operations</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-brand-400">
                    <Award className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Talent Rank Index</span>
                  </div>
                  <span className="text-2xl font-black text-slate-200">#{activeEmployee.ranking || 'N/A'}</span>
                  <span className="text-xs text-slate-500 block mt-1">Growth capacity rating across org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-850 gap-6">
            <button
              onClick={() => setActiveTab('performance')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'performance' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Performance Feedbacks
              {activeTab === 'performance' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'roadmap' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              AI Training Roadmap
              {activeTab === 'roadmap' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'projects' ? 'text-slate-100' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Active Portfolios ({activeEmployee.projects?.length || 0})
              {activeTab === 'projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            {activeTab === 'performance' && (
              <div className="glow-card border border-brand-900/30 rounded-3xl p-6 bg-gradient-to-tr from-brand-950/10 via-slate-900/30 to-purple-950/10 glow-indigo space-y-4">
                <div className="flex items-center gap-2 text-brand-400">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <h3 className="font-extrabold text-slate-200">AI Evaluation and Coaching Analysis</h3>
                </div>
                {activeEmployee.aiFeedback ? (
                  <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-brand-500 pl-4 py-1">
                    {activeEmployee.aiFeedback}
                  </p>
                ) : (
                  <div className="text-center py-6 text-slate-550 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                    <Zap className="h-8 w-8 text-slate-650 mx-auto mb-2" />
                    <p className="text-xs">No active coaching telemetry recorded. Please ask an HR Admin to trigger an AI review.</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-slate-400 font-bold uppercase tracking-wider">
                    Strengths: High Autonomy
                  </span>
                  <span className="text-[10px] bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-slate-400 font-bold uppercase tracking-wider">
                    Sprints: 100% Delivery
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="glow-card border border-slate-850 rounded-3xl p-6 bg-slate-900/30 space-y-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-extrabold text-slate-200">Competency Integration & Training Courses</h3>
                </div>
                {activeEmployee.trainingSuggestions ? (
                  <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line pl-2">
                    {activeEmployee.trainingSuggestions}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-550 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                    <BookOpen className="h-8 w-8 text-slate-650 mx-auto mb-2" />
                    <p className="text-xs">No active training roadmap seeded. Please ask an HR Admin to trigger an AI gap analysis.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEmployee.projects && activeEmployee.projects.length > 0 ? (
                  activeEmployee.projects.map((proj, idx) => (
                    <div key={idx} className="glow-card border border-slate-850 rounded-2xl p-5 bg-slate-900/30 flex items-center justify-between group hover:border-brand-900/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <h4 className="font-extrabold text-slate-250 group-hover:text-slate-100 transition-colors">{proj.name}</h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1 block">Role: {proj.role || 'Contributor'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold uppercase block">Rating Score</span>
                        <span className="text-lg font-black text-brand-350">{proj.score || 0}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    No active project histories reported.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="glow-card border border-slate-850 rounded-3xl p-16 text-center">
          <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
          <h4 className="text-slate-350 font-bold text-lg">No Operational Profile Found</h4>
          <p className="text-slate-550 text-sm mt-1 max-w-sm mx-auto">
            You are authenticated, but no corresponding Employee profile exists under your corporate email. Please ask your administrator to link your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
