import React, { memo, useMemo } from 'react';
import { Smile, Meh, Frown, Calendar } from 'lucide-react';

// ✅ Static helper functions (don’t recreate on each render)
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

const RecentEntries = memo(({ recentMoods = [], weeklyAverage = null }) => {
  // ✅ Preprocess entries only once
  const processedEntries = useMemo(() => {
    return recentMoods.map((entry, index) => ({
      ...entry,
      formattedDate: new Date(entry.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }),
      key: `${entry.date}-${index}`
    }));
  }, [recentMoods]);

  if (processedEntries.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-emerald-400" />
          <span>Recent Mood Entries</span>
        </h3>
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No mood entries yet</p>
          <p className="text-gray-500 text-sm mt-2">Start tracking your mood to see your recent entries here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
        <Calendar className="w-6 h-6 text-emerald-400" />
        <span>Recent Mood Entries</span>
        <span className="ml-auto text-sm font-normal text-gray-400">
          Last {processedEntries.length} entries
        </span>
      </h3>

      <div className="space-y-4">
        {processedEntries.map((entry) => (
          <div
            key={entry.key}
            className={`p-5 rounded-xl border ${getMoodColor(entry.mood)} hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex flex-col items-center space-y-1">
                  {getMoodIcon(entry.mood)}
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-semibold text-white">{entry.formattedDate}</p>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                      {getMoodLabel(entry.mood)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {entry.note || 'No notes added'}
                  </p>
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

      {weeklyAverage && (
        <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Weekly average:</span>
            <span className="font-semibold text-white">{weeklyAverage}/5</span>
          </div>
          <div className="mt-2 w-full bg-gray-600/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(weeklyAverage / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
});

RecentEntries.displayName = 'RecentEntries';
export default RecentEntries;
