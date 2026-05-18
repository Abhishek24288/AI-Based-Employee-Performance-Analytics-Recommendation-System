import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, error, setError, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    setLocalLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // Errors are handled in the context, showing local notification
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    setError(null);
    setValidationError('');
    if (role === 'hr') {
      setEmail('hr@guruji.ai');
      setPassword('Password123');
    } else {
      setEmail('rahul@guruji.ai');
      setPassword('Password123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans px-4">
      {/* Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-gradient-to-tr from-brand-600 to-indigo-400 p-3 rounded-2xl shadow-lg shadow-brand-500/20 mb-2">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent tracking-tight">
            GURUJI AI
          </h1>
          <p className="text-slate-400 text-sm">
            Employee Performance Analytics & Recommendation System
          </p>
        </div>

        {/* Login Panel */}
        <div className="glow-card border border-slate-800 rounded-3xl p-8 glow-indigo bg-slate-900/40 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Welcome Back</h2>

          {/* Validation/Context Error alerts */}
          {(validationError || error) && (
            <div className="mb-5 flex items-start gap-3 bg-red-950/40 border border-red-900/50 p-4 rounded-xl text-red-300 text-xs leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 text-red-400 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                <Mail className="h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                <Lock className="h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder:text-slate-650"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={localLoading}
              className="w-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {localLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Access Terminal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill demo account indicators */}
          <div className="mt-8 pt-6 border-t border-slate-850 space-y-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoFill('hr')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-brand-900/50 text-[11px] text-slate-350 font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-brand-400" /> HR Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('employee')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-brand-900/50 text-[11px] text-slate-350 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Rahul (Employee)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-medium">
          Don't have an HR account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-bold hover:underline">
            Register Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
