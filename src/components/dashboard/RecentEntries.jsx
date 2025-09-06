import React from 'react';
import { Smile, Meh, Frown, Calendar } from 'lucide-react';

const RecentEntries = () => {
  const recentMoods = [
    { date: '2025-09-03', mood: 4, note: 'Feeling positive today, work went well and had a great lunch with friends' },
    { date: '2025-09-02', mood: 3, note: 'Regular Tuesday, nothing special but got things done' },
    { date: '2025-09-01', mood: 4, note: 'Productive Monday, achieved most of my weekly goals' },
    { date: '2025-08-31', mood: 5, note: 'Amazing weekend! Went hiking and felt so refreshed' },
  ];

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'bg-emerald-900/30 border-emerald-500/50 ring-1 ring-emerald-500/20';
    if (mood >= 3) return 'bg-amber-900/30 border-amber-500/50 ring-1 ring-amber-500/20';
    return 'bg-red-900/30 border-red-500/50 ring-1 ring-red-500/20';
  };

  const getMoodIcon = (mood) => {
    if (mood >= 4) return <Smile className="w-6 h-6 text-emerald-400" />;
    if (mood >= 3) return <Meh className="w-6 h-6 text-amber-400" />;
    return <Frown className="w-6 h-6 text-red-400" />;
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    return '😔';
  };

  const getMoodLabel = (mood) => {
    if (mood === 5) return 'Excellent';
    if (mood === 4) return 'Good';
    if (mood === 3) return 'Neutral';
    if (mood === 2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50 animate-slide-up">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
        <Calendar className="w-6 h-6 text-emerald-400" />
        <span>Recent Mood Entries</span>
        <span className="ml-auto text-sm font-normal text-gray-400">Last 4 entries</span>
      </h3>
      <div className="space-y-4">
        {recentMoods.map((entry, index) => (
          <div 
            key={index} 
            className={`p-5 rounded-xl border ${getMoodColor(entry.mood)} hover:scale-[1.02] transition-all duration-200 animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex flex-col items-center space-y-1">
                  {getMoodIcon(entry.mood)}
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-semibold text-white">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                      {getMoodLabel(entry.mood)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{entry.note}</p>
                </div>
              </div>
              <div className="ml-4 text-right">
                <span className="text-2xl font-bold text-white">{entry.mood}</span>
                <span className="text-gray-400 text-sm">/5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">This week's average:</span>
          <span className="font-semibold text-white">3.8/5</span>
        </div>
        <div className="mt-2 w-full bg-gray-600/50 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{width: '76%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default RecentEntries;