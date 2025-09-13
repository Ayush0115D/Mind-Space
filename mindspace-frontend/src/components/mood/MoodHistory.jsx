import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const MoodHistory = ({ moodEntries = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample mood data if no entries provided
  const defaultMoodData = [
    { id: 1, date: '2024-09-01', mood: 4, note: 'Great day at work!', timestamp: '10:30 AM' },
    { id: 2, date: '2024-09-02', mood: 3, note: 'Feeling okay', timestamp: '2:15 PM' },
    { id: 3, date: '2024-09-03', mood: 5, note: 'Amazing weekend!', timestamp: '11:00 AM' },
    { id: 4, date: '2024-09-04', mood: 2, note: 'Bit stressed', timestamp: '4:30 PM' },
    { id: 5, date: '2024-09-05', mood: 4, note: 'Good progress', timestamp: '9:45 AM' },
  ];

  const moodData = moodEntries.length > 0 ? moodEntries : defaultMoodData;

  const moodColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-emerald-500'
  };

  const moodLabels = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent'
  };

  const moodEmojis = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄'
  };

  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ];

  const calculateAverage = () => {
    if (moodData.length === 0) return 0;
    const sum = moodData.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getTrend = () => {
    if (moodData.length < 2) return 'stable';
    
    const recent = moodData.slice(-3);
    const older = moodData.slice(-6, -3);
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((acc, entry) => acc + entry.mood, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const trend = getTrend();
  const average = calculateAverage();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
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
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{average}</div>
            <div className="text-sm text-slate-400">Average Mood</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-white">{moodData.length}</span>
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
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200">
          <ChevronLeft size={16} className="text-slate-300" />
          <span className="text-slate-300">Previous</span>
        </button>
        
        <div className="text-white font-medium">
          {selectedPeriod === 'week' && 'This Week'}
          {selectedPeriod === 'month' && 'This Month'}
          {selectedPeriod === 'year' && 'This Year'}
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200">
          <span className="text-slate-300">Next</span>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </div>

      {/* Mood Entries List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Entries</h3>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200">
            <Filter size={16} />
            <span className="text-sm">Filter</span>
          </button>
        </div>

        <div className="space-y-3">
          {moodData.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            >
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
                    {entry.note && (
                      <p className="text-slate-300 text-sm">{entry.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < entry.mood ? moodColors[entry.mood] : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {moodData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No mood entries yet</h3>
            <p className="text-slate-400 text-sm">Start tracking your mood to see your history here</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {moodData.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200">
            Load More Entries
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;