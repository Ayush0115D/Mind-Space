import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import StatsCards from './StatsCards';
import MoodChart from './MoodChart';
import RecentEntries from './RecentEntries';

const Dashboard = () => {
  const { 
    recentMoods, 
    chartData, 
    stats, 
    weeklyAverage,
    loading, 
    error, 
    refreshData 
  } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white text-lg mb-2">Unable to load dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      </div>

      {/* Stats Cards - will now only show Average Mood */}
      <StatsCards stats={stats} />

      {/* Mood Trend Analysis and Recent Mood Entries */}
      <div className="space-y-8">
        <MoodChart moodData={chartData} />
        <RecentEntries 
          recentMoods={recentMoods} 
          weeklyAverage={weeklyAverage} 
        />
      </div>

      {/* Motivational Quote */}
      <div className="text-center mt-8">
        <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400  to-green-400 soft-glow">
          “Every day may not be good, but there’s something good in every day.”
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
