import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressOverview = ({ goals }) => {
  const getProgressPercentage = (streak, target) => Math.min((streak / target) * 100, 100);
  
  // Fixed date comparison for IST timezone
  const completedToday = goals.filter(goal => {
    if (!goal.lastCompleted) return false;
    
    // Convert both dates to IST for proper comparison
    const today = new Date();
    const istToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    istToday.setHours(0, 0, 0, 0);
    
    const lastCompleted = new Date(goal.lastCompleted);
    const istLastCompleted = new Date(lastCompleted.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    istLastCompleted.setHours(0, 0, 0, 0);
    
    return istLastCompleted.getTime() === istToday.getTime();
  }).length;

  const longestStreak = goals.length > 0 ? Math.max(...goals.map(g => g.streak)) : 0;
  const goalsAchieved = goals.filter(g => g.streak >= g.target).length;
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + getProgressPercentage(g.streak, g.target), 0) / goals.length)
    : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
        Your Progress Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">{completedToday}</div>
          <div className="text-gray-400">Completed Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">{longestStreak}</div>
          <div className="text-gray-400">Longest Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">{goalsAchieved}</div>
          <div className="text-gray-400">Goals Achieved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{overallProgress}%</div>
          <div className="text-gray-400">Overall Progress</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;