import React from 'react';
import { Brain } from 'lucide-react';

const SmartSuggestions = ({ currentMood }) => {
  const moodBasedSuggestions = [
    { mood: 'low', suggestion: 'Feeling low? Try a 5-minute walk outdoors 🚶‍♀️', action: 'Take a Walk' },
    { mood: 'stressed', suggestion: 'Stress detected. How about some deep breathing? 🧘‍♂️', action: 'Breathe' },
    { mood: 'energetic', suggestion: 'Great energy! Perfect time for that workout 💪', action: 'Exercise' },
    { mood: 'tired', suggestion: 'Looking tired? Maybe focus on your sleep goal tonight 😴', action: 'Rest' }
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-full bg-blue-600/20 border border-blue-500/30">
          <Brain className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Smart Suggestions</h2>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moodBasedSuggestions.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-md hover:shadow-lg hover:border-blue-500/40 transition-all duration-300"
          >
            <p className="text-gray-300 mb-3">{item.suggestion}</p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all">
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
