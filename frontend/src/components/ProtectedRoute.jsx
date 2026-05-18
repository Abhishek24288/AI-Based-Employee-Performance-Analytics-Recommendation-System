import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
          <BrainCircuit className="h-16 w-16 text-brand-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h4 className="text-slate-350 font-bold text-sm tracking-wide animate-pulse">
          Validating Security Credentials...
        </h4>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Authenticated but does not have the required role - send to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
