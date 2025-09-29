import React, { memo, Suspense, lazy } from 'react';
import { Sparkles } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';

// Lazy load components that are not immediately visible
const LazyRecentEntries = lazy(() => import('./RecentEntries'));
const LazyMotivationalQuoteCard = lazy(() => import('./MotivationalQuoteCard'));

// Regular imports for above-the-fold components
import StatsCards from './StatsCards';
import MoodChart from './MoodChart';

// Loading component for Suspense fallbacks
const ComponentLoader = memo(() => (
  <div className="animate-pulse bg-gray-900/50 rounded-2xl p-6">
    <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-800 rounded"></div>
      <div className="h-3 bg-gray-800 rounded w-5/6"></div>
    </div>
  </div>
));

ComponentLoader.displayName = 'ComponentLoader';

const Dashboard = memo(() => {
  const {
    recentMoods,
    chartData,
    stats,
    weeklyAverage,
    loading,
    error,
    refreshData
  } = useDashboardData();

  // Show loading state
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

  // Show error state
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
    <div className="space-y-12 bg-gray-900/90 p-8 rounded-3xl shadow-lg">
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

      {/* Stats Cards Grid - Immediate load */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCards stats={stats} />
        <Suspense fallback={<ComponentLoader />}>
          <LazyMotivationalQuoteCard />
        </Suspense>
      </div>

      {/* Mood Chart - Immediate load since it's above fold */}
      <MoodChart moodData={chartData} />

      {/* Recent Entries - Lazy loaded since it's below fold */}
      <Suspense fallback={<ComponentLoader />}>
        <LazyRecentEntries
          recentMoods={recentMoods}
          weeklyAverage={weeklyAverage}
        />
      </Suspense>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
