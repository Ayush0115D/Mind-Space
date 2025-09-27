import React, { useState, useCallback, useMemo } from 'react';
import { Heart, Plus } from 'lucide-react';

const MoodEntry = React.memo(({ onAddEntry, apiUrl }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_URL = useMemo(() => 
    apiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000", [apiUrl]
  );

  const sliderStyle = useMemo(() => ({
    background: `linear-gradient(to right, #8b5cf6 ${(mood - 1) * 25}%, #374151 ${(mood - 1) * 25}%)`
  }), [mood]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to submit mood');

      // Send current timestamp - let backend handle IST conversion
      const now = new Date();
      
      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: parseInt(mood),
          note: note.trim(),
          // Send full timestamp, not just date
          date: now.toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        onAddEntry({ 
          _id: data.data._id, 
          mood: parseInt(mood), 
          note: note.trim(), 
          date: data.data.date, // Use the date from server response
          ...data.data 
        });
        setMood(3);
        setNote('');
      } else {
        setError(data.message || 'Failed to save mood');
      }
    } catch (error) {
      setError(error.message || 'Failed to save mood');
    } finally {
      setIsSubmitting(false);
    }
  }, [API_URL, mood, note, onAddEntry, isSubmitting]);

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Heart className="w-7 h-7 text-pink-400" />
        <span>How are you feeling today?</span>
      </h3>
      
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-4">
            Mood Level: <span className="text-purple-400 text-xl">{mood}/5</span>
          </label>
          <input type="range" min="1" max="5" value={mood} onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer appearance-none accent-pink-500" style={sliderStyle} disabled={isSubmitting} />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Very Low</span><span>Low</span><span>Neutral</span><span>Good</span><span>Excellent</span>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-300 mb-3">Add a note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's influencing your mood today?"
            className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all"
            rows="4" disabled={isSubmitting} />
        </div>
        
        <button onClick={handleSubmit} disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-5 h-5" />
          <span>{isSubmitting ? 'Saving...' : 'Submit Mood'}</span>
        </button>
      </div>
    </div>
  );
});

MoodEntry.displayName = 'MoodEntry';
export default MoodEntry;