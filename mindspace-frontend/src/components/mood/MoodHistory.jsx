import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// Memoized single entry to prevent unnecessary re-renders
const MoodEntryItem = React.memo(({ entry, moodColors, moodLabels, moodEmojis, formatDate }) => (
  <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${moodColors[entry.mood]} flex items-center justify-center text-white font-bold`}>
            {entry.mood}
          </div>
          <div className="text-2xl">{moodEmojis[entry.mood]}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-white">{moodLabels[entry.mood]}</span>
            <span className="text-slate-400 text-sm">•</span>
            <span className="text-slate-400 text-sm">{formatDate(entry.date)}</span>
            {entry.timestamp && (
              <>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-slate-400 text-sm">{entry.timestamp}</span>
              </>
            )}
          </div>
          {entry.note && <p className="text-slate-300 text-sm">{entry.note}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx < entry.mood ? moodColors[entry.mood] : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
));

const MoodHistory = ({ moodEntries = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const moodColors = useMemo(() => ({
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-emerald-500'
  }), []);

  const moodLabels = useMemo(() => ({
    1: 'Very Poor',
    2: 'Poor',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent'
  }), []);

  const moodEmojis = useMemo(() => ({
    1: '😢',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄'
  }), []);

  // Calculate average mood
  const average = useMemo(() => {
    if (!moodEntries.length) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  }, [moodEntries]);

  // Determine trend
  const trend = useMemo(() => {
    if (moodEntries.length < 2) return 'stable';
    const recent = moodEntries.slice(-3);
    const older = moodEntries.slice(-6, -3);
    const recentAvg = recent.reduce((acc, e) => acc + e.mood, 0) / recent.length;
    const olderAvg = older.length ? older.reduce((acc, e) => acc + e.mood, 0) / older.length : recentAvg;
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  }, [moodEntries]);

  // Format date in IST
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60; // +5:30 in minutes
    const istDate = new Date(date.getTime() + istOffset * 60 * 1000);

    const today = new Date();
    const istToday = new Date(today.getTime() + istOffset * 60 * 1000);
    const yesterday = new Date(istToday);
    yesterday.setDate(yesterday.getDate() - 1);

    if (istDate.toDateString() === istToday.toDateString()) return 'Today';
    if (istDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return istDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mood History</h2>
              <p className="text-slate-400 text-sm">Track your emotional journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {['week','month','year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period ? 'bg-purple-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {moodEntries.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">{average}</div>
              <div className="text-sm text-slate-400">Average Mood</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{moodEntries.length}</span>
                {trend === 'improving' && <TrendingUp className="w-5 h-5 text-green-400" />}
                {trend === 'declining' && <TrendingDown className="w-5 h-5 text-red-400" />}
                {trend === 'stable' && <Minus className="w-5 h-5 text-yellow-400" />}
              </div>
              <div className="text-sm text-slate-400">Total Entries</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {trend === 'improving' && '📈'}
                {trend === 'declining' && '📉'}
                {trend === 'stable' && '➡️'}
              </div>
              <div className="text-sm text-slate-400 capitalize">{trend} Trend</div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {moodEntries.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No mood entries yet</h3>
            <p className="text-slate-400 text-sm">Start tracking your mood to see statistics here</p>
          </div>
        )}
      </div>

      {/* Mood List */}
      {moodEntries.length > 0 && (
        <div className="space-y-3">
          {moodEntries.map((entry, idx) => (
            <MoodEntryItem
              key={entry.id || idx}
              entry={entry}
              moodColors={moodColors}
              moodLabels={moodLabels}
              moodEmojis={moodEmojis}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
