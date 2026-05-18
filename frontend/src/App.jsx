import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails';
import AIRecommendations from './pages/AIRecommendations';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { AIProvider } from './context/AIContext';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <AIProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes inside Dashboard Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={['hr', 'employee']}>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <Layout>
                      <EmployeeList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-employee"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <Layout>
                      <AddEmployee />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees/:id"
                element={
                  <ProtectedRoute allowedRoles={['hr', 'employee']}>
                    <Layout>
                      <EmployeeDetails />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-recommendations"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <Layout>
                      <AIRecommendations />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </AIProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default App;
