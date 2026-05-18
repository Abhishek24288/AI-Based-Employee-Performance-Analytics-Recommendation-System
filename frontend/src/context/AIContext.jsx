import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AIContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-based-employee-performance-analytics-72ye.onrender.com/api';

export const AIProvider = ({ children }) => {
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [savedReports, setSavedReports] = useState(
    JSON.parse(localStorage.getItem('saved_ai_reports') || '[]')
  );

  // Generate Career Roadmap, Skill Gap analysis or promotion ranking
  const getAIRecommendation = async ({ employeeId, department, focusArea }) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/recommend`, {
        employeeId,
        department,
        focusArea
      });
      setAiReport(response.data);
      return response.data;
    } catch (err) {
      console.error('Error generating AI recommendation:', err);
      const msg =
        err.response?.data?.error ||
        'Failed to generate AI recommendations. Make sure your OpenRouter API key is configured.';
      setAiError(msg);
      throw new Error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  // Save AI Reports to local storage for quick access
  const saveReport = (report) => {
    const reportWithMeta = {
      ...report,
      id: 'REP_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    const updated = [reportWithMeta, ...savedReports];
    setSavedReports(updated);
    localStorage.setItem('saved_ai_reports', JSON.stringify(updated));
    return reportWithMeta;
  };

  // Delete saved report
  const deleteReport = (id) => {
    const updated = savedReports.filter(rep => rep.id !== id);
    setSavedReports(updated);
    localStorage.setItem('saved_ai_reports', JSON.stringify(updated));
  };

  const clearActiveReport = () => {
    setAiReport(null);
  };

  // Send message query to chatbot backend
  const sendChatQuery = async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, { message });
      return response.data.reply;
    } catch (err) {
      console.error('Error in chatbot query:', err);
      throw new Error(err.response?.data?.error || 'Failed to communicate with AI Copilot.');
    }
  };

  return (
    <AIContext.Provider
      value={{
        aiReport,
        aiLoading,
        aiError,
        savedReports,
        getAIRecommendation,
        saveReport,
        deleteReport,
        clearActiveReport,
        sendChatQuery,
        setAiError
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
