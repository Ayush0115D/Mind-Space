import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MoodEntry from './MoodEntry';
import MoodHistory from './MoodHistory';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch moods from API
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
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

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
        }
      } catch (err) {
        setError(err.message || 'Failed to load moods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoods();
  }, [API_URL]);

  // Add new mood entry efficiently using useCallback
  const addMoodEntry = useCallback(
    (newEntry) => {
      setMoodEntries(prev => [newEntry, ...prev]);
    },
    []
  );

  // Memoize the mood entries to avoid re-rendering MoodHistory unnecessarily
  const memoizedMoodEntries = useMemo(() => moodEntries, [moodEntries]);

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
      <MoodHistory moodEntries={memoizedMoodEntries} />
    </div>
  );
};

export default MoodTracker;
