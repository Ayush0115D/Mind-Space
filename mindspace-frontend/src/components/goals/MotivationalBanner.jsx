import React from 'react';
import { Sparkles } from 'lucide-react';

const MotivationalBanner = ({ message, stats }) => {
  const completedToday = stats?.completedToday ?? 0;
  const totalGoals = stats?.totalGoals ?? 0;
  
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white mb-6 shadow-xl border border-gray-700">
      <div className="flex items-center space-x-3">
        <Sparkles className="h-8 w-8 text-yellow-400" />
        <div>
          <h3 className="text-xl font-bold text-white">{message}</h3>
          <p className="text-gray-400 mt-1">
            {completedToday} of {totalGoals} goals completed today
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationalBanner;