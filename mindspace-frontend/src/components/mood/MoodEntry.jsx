import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';

const MoodEntry = ({ onAddEntry }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      mood: mood,
      note: note
    };
    onAddEntry(newEntry);
    setMood(3);
    setNote('');
  };

  // Progress fill style (dynamic background based on mood value)
  const sliderStyle = {
    background: `linear-gradient(to right, #ec4899 ${(mood - 1) * 25}%, #374151 ${(mood - 1) * 25}%)`
    // pink fill → gray background
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Heart className="w-7 h-7 text-pink-400" />
        <span>How are you feeling today?</span>
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Mood Level: <span className="text-purple-400 text-xl">{mood}/5</span>
          </label>

          {/* Slider with dynamic progress fill */}
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer appearance-none accent-pink-500"
            style={sliderStyle}
          />

          {/* Labels */}
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Very Low</span>
            <span>Low</span>
            <span>Neutral</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-3">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's influencing your mood today?"
            className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl 
                       focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                       text-white placeholder-gray-400 transition-all"
            rows="4"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 
                     rounded-xl hover:from-purple-700 hover:to-pink-700 
                     transition-all duration-300 flex items-center space-x-3 
                     font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Log Mood</span>
        </button>
      </div>
    </div>
  );
};

export default MoodEntry;
