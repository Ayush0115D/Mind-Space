import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Lightbulb } from 'lucide-react';

const SmartSuggestions = ({ currentMood }) => {
  const [completedSuggestions, setCompletedSuggestions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const moodBasedSuggestions = [
    { 
      mood: 'stressed', 
      suggestion: 'Feeling stressed? How about some deep breathing?', 
      emoji: '🧘‍♂️',
      action: 'Breathe',
      color: 'from-purple-600 to-indigo-600',
      hoverColor: 'from-purple-700 to-indigo-700',
      bgGradient: 'from-purple-900/20 to-indigo-900/20'
    },
    { 
      mood: 'tired', 
      suggestion: 'Looking tired? Maybe focus on your sleep goal tonight', 
      emoji: '😴',
      action: 'Rest',
      color: 'from-blue-600 to-cyan-600',
      hoverColor: 'from-blue-700 to-cyan-700',
      bgGradient: 'from-blue-900/20 to-cyan-900/20'
    },
    { 
      mood: 'low', 
      suggestion: 'Feeling low? Try a 5-minute walk outdoors', 
      emoji: '🚶‍♀️',
      action: 'Take a Walk',
      color: 'from-green-600 to-emerald-600',
      hoverColor: 'from-green-700 to-emerald-700',
      bgGradient: 'from-green-900/20 to-emerald-900/20'
    },
    { 
      mood: 'energetic', 
      suggestion: 'Great energy! Perfect time for that workout', 
      emoji: '💪',
      action: 'Exercise',
      color: 'from-orange-600 to-red-600',
      hoverColor: 'from-orange-700 to-red-700',
      bgGradient: 'from-orange-900/20 to-red-900/20'
    }
  ];

  const handleComplete = (index) => {
    if (!completedSuggestions.includes(index)) {
      setCompletedSuggestions([...completedSuggestions, index]);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 mb-6 shadow-2xl overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative p-3 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/30 shadow-lg">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-2xl animate-pulse"></div>
            <Lightbulb className="h-7 w-7 text-cyan-300 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text">
            Smart Suggestions
          </h2>
        </div>
        <div className="hidden md:block text-sm text-gray-500">
          {completedSuggestions.length}/{moodBasedSuggestions.length} completed
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
        {moodBasedSuggestions.map((item, index) => {
          const isCompleted = completedSuggestions.includes(index);
          const isHovered = hoveredIndex === index;
          
          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative group bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm rounded-xl p-5 border transition-all duration-500 ${
                isCompleted 
                  ? 'border-green-500/40 bg-green-900/10' 
                  : isHovered 
                    ? 'border-blue-500/60 shadow-xl shadow-blue-500/20 -translate-y-1' 
                    : 'border-gray-700/50 shadow-lg'
              }`}
            >
              {/* Completion overlay */}
              {isCompleted && (
                <div className="absolute inset-0 bg-green-500/5 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-8 h-8" />
                    <span className="font-semibold">Completed!</span>
                  </div>
                </div>
              )}

              {/* Card glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500 blur-xl`}></div>

              {/* Content */}
              <div className={`relative ${isCompleted ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}>
                {/* Emoji badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    isCompleted 
                      ? 'bg-green-500/20 border-green-500/30 text-green-300'
                      : 'bg-gray-800/50 border-gray-600/30 text-gray-400'
                  }`}>
                    {item.mood}
                  </div>
                </div>

                {/* Suggestion text */}
                <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                  {item.suggestion}
                </p>

                {/* Action button */}
                <button 
                  onClick={() => handleComplete(index)}
                  disabled={isCompleted}
                  className={`relative w-full bg-gradient-to-r ${item.color} text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden group/btn ${
                    isCompleted 
                      ? 'opacity-50 cursor-not-allowed' 
                      : `hover:${item.hoverColor} hover:shadow-lg hover:scale-105 active:scale-95`
                  }`}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10">{item.action}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      {completedSuggestions.length > 0 && (
        <div className="relative mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Daily Progress</span>
            <span className="text-sm font-semibold text-cyan-400">
              {Math.round((completedSuggestions.length / moodBasedSuggestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50"
              style={{ width: `${(completedSuggestions.length / moodBasedSuggestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;