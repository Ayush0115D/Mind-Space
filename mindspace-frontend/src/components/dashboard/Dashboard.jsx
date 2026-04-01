import React, { memo, Suspense, lazy, useState, useEffect } from 'react';
import { Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
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

// ✨ Wellness Tips — changes daily based on day of year
const WELLNESS_TIPS = [
  { tip: "Take 5 deep breaths before checking your phone in the morning.", category: "Mindfulness", emoji: "🧘" },
  { tip: "Drink a glass of water first thing when you wake up.", category: "Physical", emoji: "💧" },
  { tip: "Write down 3 things you're grateful for today.", category: "Mental", emoji: "📝" },
  { tip: "Step outside for at least 10 minutes of natural light.", category: "Physical", emoji: "☀️" },
  { tip: "Put your phone away 30 minutes before bed for better sleep.", category: "Sleep", emoji: "😴" },
  { tip: "Reach out to a friend or family member you haven't spoken to in a while.", category: "Social", emoji: "💬" },
  { tip: "Take a 5-minute break every hour to stretch your body.", category: "Physical", emoji: "🤸" },
  { tip: "Notice one beautiful thing around you right now.", category: "Mindfulness", emoji: "🌸" },
  { tip: "Eat your meals slowly and without screens for better digestion.", category: "Physical", emoji: "🥗" },
  { tip: "Spend 10 minutes journaling about your current feelings.", category: "Mental", emoji: "💭" },
  { tip: "Practice saying 'no' to one thing that drains your energy today.", category: "Mental", emoji: "🛡️" },
  { tip: "Go to bed at the same time tonight to regulate your sleep cycle.", category: "Sleep", emoji: "🌙" },
  { tip: "Do one random act of kindness, however small.", category: "Social", emoji: "❤️" },
  { tip: "Take a 10-minute walk after your next meal.", category: "Physical", emoji: "🚶" },
  { tip: "Listen to music that makes you feel good for 15 minutes.", category: "Mental", emoji: "🎵" },
  { tip: "Tidy up one small area of your space — a clean space helps a clear mind.", category: "Mental", emoji: "🧹" },
  { tip: "Try a 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s.", category: "Mindfulness", emoji: "🌬️" },
  { tip: "Limit news consumption to 15 minutes today.", category: "Mental", emoji: "📵" },
  { tip: "Do something creative today — draw, cook, write, anything.", category: "Mental", emoji: "🎨" },
  { tip: "Spend time in nature, even if it's just sitting by a window.", category: "Mindfulness", emoji: "🌿" },
  { tip: "Compliment yourself for one thing you did well recently.", category: "Mental", emoji: "🌟" },
  { tip: "Set one small, achievable goal for today and celebrate when done.", category: "Mental", emoji: "🎯" },
  { tip: "Avoid caffeine after 2 PM for better sleep quality.", category: "Sleep", emoji: "☕" },
  { tip: "Smile at a stranger today — it benefits both of you.", category: "Social", emoji: "😊" },
  { tip: "Spend 5 minutes in complete silence, just observing your thoughts.", category: "Mindfulness", emoji: "🤫" },
  { tip: "Hydrate well — aim for 8 glasses of water today.", category: "Physical", emoji: "🫗" },
  { tip: "Call someone you love and have a real conversation.", category: "Social", emoji: "📞" },
  { tip: "Forgive yourself for one mistake you've been holding onto.", category: "Mental", emoji: "🕊️" },
  { tip: "Try a 10-minute guided meditation before bed.", category: "Sleep", emoji: "✨" },
  { tip: "Plan tomorrow the night before to reduce morning stress.", category: "Mental", emoji: "📋" },
  { tip: "Celebrate small wins — progress is still progress.", category: "Mental", emoji: "🏆" },
];

const CATEGORY_COLORS = {
  Mindfulness: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500' },
  Physical:    { bg: 'bg-green-500/15',  border: 'border-green-500/30',  text: 'text-green-400',  dot: 'bg-green-500' },
  Mental:      { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-400',   dot: 'bg-blue-500' },
  Sleep:       { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-500' },
  Social:      { bg: 'bg-pink-500/15',   border: 'border-pink-500/30',   text: 'text-pink-400',   dot: 'bg-pink-500' },
};

const WellnessTipCard = memo(() => {
  const [tipIndex, setTipIndex] = useState(() => {
    // Default: daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % WELLNESS_TIPS.length;
  });
  const [refreshing, setRefreshing] = useState(false);

  const tip = WELLNESS_TIPS[tipIndex];
  const colors = CATEGORY_COLORS[tip.category] || CATEGORY_COLORS.Mental;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % WELLNESS_TIPS.length);
      setRefreshing(false);
    }, 300);
  };

  return (
    <div className={`rounded-2xl p-5 border ${colors.bg} ${colors.border} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold text-white">Wellness Tip of the Day</span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
          title="Get another tip"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tip */}
      <div className="flex gap-3">
        <span className="text-3xl shrink-0">{tip.emoji}</span>
        <p className="text-gray-200 text-sm leading-relaxed">{tip.tip}</p>
      </div>

      {/* Category badge */}
      <div className="mt-3 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className={`text-xs font-medium ${colors.text}`}>{tip.category}</span>
      </div>
    </div>
  );
});
WellnessTipCard.displayName = 'WellnessTipCard';

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

      {/* ✨ Wellness Tip of the Day — full width */}
      <WellnessTipCard />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCards stats={stats} />
        <Suspense fallback={<ComponentLoader />}>
          <LazyMotivationalQuoteCard />
        </Suspense>
      </div>

      {/* Mood Chart */}
      <MoodChart moodData={chartData} />

      {/* Recent Entries */}
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