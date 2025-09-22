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
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setMoodEntries(data.data || []);
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

  // Add new mood entry
  const addMoodEntry = useCallback((newEntry) => {
    setMoodEntries(prev => [newEntry, ...prev]);
  }, []);

  // Update mood entry
  const updateMoodEntry = useCallback(async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/moods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMoodEntries(prev =>
          prev.map(entry =>
            entry._id === id ? { ...entry, ...data.data } : entry
          )
        );
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update mood' };
    }
  }, [API_URL]);

  // Delete mood entry
  const deleteMoodEntry = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/moods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMoodEntries(prev => prev.filter(entry => entry._id !== id));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to delete mood' };
    }
  }, [API_URL]);

  const memoizedMoodEntries = useMemo(() => moodEntries, [moodEntries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          <div className="text-white">Loading moods...</div>
        </div>
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
      <MoodHistory 
        moodEntries={memoizedMoodEntries} 
        onUpdateMood={updateMoodEntry} 
        onDeleteMood={deleteMoodEntry} 
      />
    </div>
  );
};

export default MoodTracker;
