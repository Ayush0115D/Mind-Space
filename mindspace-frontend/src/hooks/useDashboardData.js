import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useDashboardData = () => {
  const [recentMoods, setRecentMoods] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ averageMood: 0, period: '' }); // removed completedGoals & longestStreak
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => localStorage.getItem('token');

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
      if (!res.ok) throw new Error('Failed to fetch dashboard data');

      const data = await res.json();

      setRecentMoods(data.recent || []);
      setChartData(data.chart || []);

      // Keep only Average Mood & period
      const statistics = data.statistics || {};
      setStats({
        averageMood: statistics.averageMood || 0,
        period: statistics.period || 'Last 7 days'
      });

      setWeeklyAverage(data.weekly?.weeklyAverage || 0);
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err.message);

      setRecentMoods([]);
      setChartData([]);
      setStats({ averageMood: 0, period: 'Last 7 days' });
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
