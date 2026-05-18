import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const EmployeeContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-based-employee-performance-analytics-72ye.onrender.com/api';

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees (HR only)
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.response?.data?.error || 'Failed to load employee list.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single employee by ID (HR or Owner)
  const fetchEmployeeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
      setSelectedEmployee(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching employee details:', err);
      setError(err.response?.data?.error || 'Failed to load employee details.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new employee (HR only)
  const addEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
      setEmployees((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Error adding employee:', err);
      const msg = err.response?.data?.error || 'Failed to add employee.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Update employee (HR or Owner)
  const updateEmployee = async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/employees/${id}`, employeeData);
      
      // Update local state list
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id || emp.employeeId === id ? response.data : emp))
      );
      
      // Update selected employee details if active
      if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.employeeId === id)) {
        setSelectedEmployee(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating employee:', err);
      const msg = err.response?.data?.error || 'Failed to update employee details.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee (HR only)
  const deleteEmployee = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id && emp.employeeId !== id));
      if (selectedEmployee && (selectedEmployee._id === id || selectedEmployee.employeeId === id)) {
        setSelectedEmployee(null);
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      const msg = err.response?.data?.error || 'Failed to delete employee.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter employees (HR only)
  const searchEmployees = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const { department, skill, experience, performanceScore } = filters;
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (skill) params.append('skill', skill);
      if (experience) params.append('experience', experience);
      if (performanceScore) params.append('performanceScore', performanceScore);

      const response = await axios.get(`${API_BASE_URL}/employees/search?${params.toString()}`);
      setEmployees(response.data);
      return response.data;
    } catch (err) {
      console.error('Error filtering employees:', err);
      setError(err.response?.data?.error || 'Failed to filter employees.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        selectedEmployee,
        setSelectedEmployee,
        fetchEmployees,
        fetchEmployeeById,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
