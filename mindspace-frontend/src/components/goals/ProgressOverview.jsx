import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressOverview = ({ goals }) => {
  const getProgressPercentage = (streak, target) => Math.min((streak / target) * 100, 100);

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <TrendingUp className="h-6 w-6 mr-3 text-green-400" />
        Your Progress Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">
            {goals.filter(g => g.completed).length}
          </div>
          <div className="text-gray-400">Completed Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">
            {Math.max(...goals.map(g => g.streak), 0)}
          </div>
          <div className="text-gray-400">Longest Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {goals.filter(g => g.streak >= g.target).length}
          </div>
          <div className="text-gray-400">Goals Achieved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">
            {Math.round(goals.reduce((acc, g) => acc + getProgressPercentage(g.streak, g.target), 0) / goals.length) || 0}%
          </div>
          <div className="text-gray-400">Overall Progress</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
