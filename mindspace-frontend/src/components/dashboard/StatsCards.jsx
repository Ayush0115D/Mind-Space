import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats = {} }) => {
  const defaultStats = {
    averageMood: stats.averageMood || null,
    period: stats.period || 'Last 7 days'
  };

  const moodValue = defaultStats.averageMood ? `${defaultStats.averageMood}/5` : '4/5';
  const moodScore = defaultStats.averageMood || 4;
  
  // Create a mood description based on the score
  const getMoodDescription = (score) => {
    if (score >= 4.5) return "Excellent mood trend";
    if (score >= 4) return "Great mood progress";
    if (score >= 3.5) return "Good mood balance";
    if (score >= 3) return "Steady mood level";
    return "Building positive habits";
  };

  const getMoodEmoji = (score) => {
    if (score >= 4.5) return "🌟";
    if (score >= 4) return "😊";
    if (score >= 3.5) return "🙂";
    if (score >= 3) return "😐";
    return "🌱";
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-medium font-medium text-gray-300 mb-1">Average Mood</p>
          <p className="text-sm text-gray-500">{defaultStats.period}</p>
        </div>
        <div className="p-3 bg-purple-600/20 rounded-xl">
          <Activity className="w-8 h-8 text-purple-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getMoodEmoji(moodScore)}</span>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {moodValue}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <p className="text-sm text-gray-300">{getMoodDescription(moodScore)}</p>
        </div>
        
        {/* Mood progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 via bg-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(moodScore / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;