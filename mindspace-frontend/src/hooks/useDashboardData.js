// hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useDashboardData = () => {
  const [recentMoods, setRecentMoods] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ averageMood: 0, goalsCount: 0, period: '' });
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('token');

  // Create headers with auth token
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = getHeaders();
      const res = await fetch(`${API_BASE}/api/dashboard`, { headers });

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await res.json();

      // Map backend response to frontend state
      setRecentMoods(data.recent || []);
      setChartData(data.chart || []);
      setStats(data.statistics || { averageMood: 0, goalsCount: 0, period: '' });
      setWeeklyAverage(data.weekly?.weeklyAverage || 0);

      // Debug log
      console.log("📊 Dashboard API response:", data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);

      // Reset state on error
      setRecentMoods([]);
      setChartData([]);
      setStats({ averageMood: 0, goalsCount: 0, period: '' });
      setWeeklyAverage(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    recentMoods,
    chartData,
    stats,
    weeklyAverage,
    loading,
    error,
    refreshData: fetchDashboardData
  };
};
