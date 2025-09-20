import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';

const MoodEntry = ({ onAddEntry, apiUrl }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fallback API URL if not passed as prop
  const API_URL = apiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get auth token (adjust this based on how you store your token)
      const token = localStorage.getItem('token'); // or however you store it
      
      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add your auth header
        },
        body: JSON.stringify({
          mood: mood,
          note: note,
          date: today
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add to local state for immediate UI update
        const newEntry = {
          ...data.data,
          id: data.data._id
        };
        onAddEntry(newEntry);
        
        // Reset form
        setMood(3);
        setNote('');
        console.log('✅ Mood saved successfully!');
      } else {
        setError(data.message || 'Failed to save mood');
        console.error('❌ API Error:', data.message);
      }
    } catch (error) {
      setError('Failed to save mood. Please try again.');
      console.error('❌ Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress fill style (dynamic background based on mood value)
  const sliderStyle = {
    background: `linear-gradient(to right, #ec4899 ${(mood - 1) * 25}%, #374151 ${(mood - 1) * 25}%)`
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Heart className="w-7 h-7 text-pink-400" />
        <span>How are you feeling today?</span>
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Mood Level: <span className="text-purple-400 text-xl">{mood}/5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer appearance-none accent-pink-500"
            style={sliderStyle}
            disabled={isSubmitting}
          />
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
            disabled={isSubmitting}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3
                     rounded-xl hover:from-purple-700 hover:to-pink-700
                     transition-all duration-300 flex items-center space-x-3
                     font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/20
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>{isSubmitting ? 'Saving...' : 'Submit Mood'}</span>
        </button>
      </div>
    </div>
  );
};

export default MoodEntry;