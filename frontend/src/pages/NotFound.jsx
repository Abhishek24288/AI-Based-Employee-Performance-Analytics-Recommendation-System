import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-500/5 blur-[120px]" />

      <div className="max-w-md w-full text-center space-y-6 z-10">
        <div className="inline-flex bg-brand-950/40 border border-brand-900/30 p-5 rounded-3xl text-brand-400 glow-indigo shadow-lg shadow-brand-500/10 animate-bounce" style={{ animationDuration: '4s' }}>
          <Compass className="h-12 w-12 text-brand-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">404 - Grid Lost</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            The telemetry coordinate you requested could not be resolved in our network registry.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-750 text-slate-350 hover:text-slate-200 font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
