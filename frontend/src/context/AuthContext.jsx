import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Use dynamic API endpoint so it works both locally and in production (e.g. Render)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure Axios defaults dynamically whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  // Load user data on startup
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Failed to load user session:', err.message);
      // Clear invalid session tokens
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  // Signup handler
  const signup = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        role
      });
      setToken(response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    } catch (err) {
      console.error('Signup Context Error:', err);
      const errMsg = err.response?.data?.error || 'Failed to sign up.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      setToken(response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    } catch (err) {
      console.error('Login Context Error:', err);
      const errMsg = err.response?.data?.error || 'Invalid credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        signup,
        login,
        logout,
        loadUser,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
