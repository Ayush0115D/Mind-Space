// hooks/useDashboardData.js
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useDashboardData = () => {
  const [recentMoods, setRecentMoods] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({});
  const [weeklyAverage, setWeeklyAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create headers with auth token
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = getHeaders();

      // Fetch all dashboard data in parallel
      const [recentRes, chartRes, statsRes, weeklyRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/recent-moods`, { headers }),
        fetch(`${API_BASE}/api/dashboard/mood-chart`, { headers }),
        fetch(`${API_BASE}/api/dashboard/stats`, { headers }),
        fetch(`${API_BASE}/api/dashboard/weekly-average`, { headers })
      ]);

      // Check if any request failed
      if (!recentRes.ok || !chartRes.ok || !statsRes.ok || !weeklyRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Parse all responses
      const [recent, chart, statistics, weekly] = await Promise.all([
        recentRes.json(),
        chartRes.json(),
        statsRes.json(),
        weeklyRes.json()
      ]);

      // Set state with fetched data
      setRecentMoods(recent);
      setChartData(chart);
      setStats(statistics);
      setWeeklyAverage(weekly.weeklyAverage);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      
      // Set empty data on error to prevent component crashes
      setRecentMoods([]);
      setChartData([]);
      setStats({});
      setWeeklyAverage(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh function for manual updates
  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    recentMoods,
    chartData,
    stats,
    weeklyAverage,
    loading,
    error,
    refreshData
  };
};