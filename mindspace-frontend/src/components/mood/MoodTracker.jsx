import React, { useState, useEffect } from 'react';
import MoodEntry from './MoodEntry';
import MoodHistory from './MoodHistory';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get API URL from env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your moods');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/moods`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("📥 Raw server response:", text);
          throw new Error("Invalid server response (not JSON)");
        }

        const data = await response.json();

        if (response.ok && data.success) {
          setMoodEntries(data.data || []);
          console.log('✅ Moods loaded:', data.data.length);
        } else {
          setError(data.message || 'Failed to load moods');
          console.error('❌ API Error:', data.message);
        }
      } catch (error) {
        setError(error.message || 'Failed to load moods');
        console.error('❌ Network/Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoods();
  }, [API_URL]);

  const addMoodEntry = (newEntry) => {
    setMoodEntries([newEntry, ...moodEntries]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading your moods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MoodEntry onAddEntry={addMoodEntry} />
      <MoodHistory moodEntries={moodEntries} />
    </div>
  );
};

export default MoodTracker;
