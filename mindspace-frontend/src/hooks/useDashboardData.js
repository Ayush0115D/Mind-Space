import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Cache to store dashboard data
const dashboardCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDashboardData = () => {
  const [recentMoods, setRecentMoods] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ averageMood: 0, period: '' });
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  const getAuthToken = () => localStorage.getItem('token');
  
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Check cache first
  const getCachedData = () => {
    const cached = dashboardCache.get('dashboard');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedData = (data) => {
    dashboardCache.set('dashboard', {
      data,
      timestamp: Date.now()
    });
  };

  const fetchDashboardData = useCallback(async () => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData && !loading) {
      setRecentMoods(cachedData.recent || []);
      setChartData(cachedData.chart || []);
      setStats({
        averageMood: cachedData.statistics?.averageMood || 0,
        period: cachedData.statistics?.period || 'Last 7 days'
      });
      setWeeklyAverage(cachedData.weekly?.weeklyAverage || 0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      const headers = getHeaders();
      
      // 🔧 FIX: Explicitly request 7 days of chart data
      const res = await fetch(`${API_BASE}/api/dashboard?chartDays=7`, { 
        headers,
        signal: abortController.current.signal
      });
      
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await res.json();
      
      // Cache the response
      setCachedData(data);
      
      // Update state
      setRecentMoods(data.recent || []);
      setChartData(data.chart || []);
      
      const statistics = data.statistics || {};
      setStats({
        averageMood: statistics.averageMood || 0,
        period: statistics.period || 'Last 7 days'
      });
      
      setWeeklyAverage(data.weekly?.weeklyAverage || 0);
    } catch (err) {
      if (err.name === 'AbortError') return; // Request was cancelled
      
      console.error('❌ Dashboard fetch error:', err);
      setError(err.message);
      
      // Set empty defaults
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
    
    // Cleanup on unmount
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
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