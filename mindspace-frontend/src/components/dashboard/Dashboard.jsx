import React from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import StatsCards from './StatsCards';
import MoodChart from './MoodChart';
import RecentEntries from './RecentEntries';
import MotivationalQuoteCard from './MotivationalQuoteCard'; // Add this import

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
        <div className="flex items-center space-x-3 group">
          <Sparkles className="w-7 h-7 text-blue-400 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">
            Your Wellness Hub
          </h2>
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse delay-75" />
        </div>
      </div>

      {/* Stats Cards Grid - now includes the quote card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCards stats={stats} />
        <MotivationalQuoteCard />
      </div>

      {/* Mood Trend Analysis and Recent Mood Entries */}
      <div className="space-y-8">
        <MoodChart moodData={chartData} />
        <RecentEntries
          recentMoods={recentMoods}
          weeklyAverage={weeklyAverage}
        />
      </div>
    </div>
  );
};

export default Dashboard;