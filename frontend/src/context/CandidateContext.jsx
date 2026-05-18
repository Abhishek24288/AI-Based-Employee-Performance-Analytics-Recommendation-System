import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CandidateContext = createContext();

const API_BASE_URL = 'https://ai-based-employee-performance-analytics-72ye.onrender.com/api';

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/candidates`);
      setCandidates(response.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err.response?.data?.error || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (candidateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/candidates`, candidateData);
      setCandidates((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Error adding candidate:', err);
      setError(err.response?.data?.error || 'Failed to add candidate.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Error deleting candidate:', err);
      setError(err.response?.data?.error || 'Failed to delete candidate.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        loading,
        error,
        fetchCandidates,
        addCandidate,
        deleteCandidate,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};
