import React, { useState, useEffect, useMemo } from 'react';
import MoodEntry from './MoodEntry';
import MoodHistory from './MoodHistory';

const MoodTracker = React.memo(() => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = useMemo(() => import.meta.env.VITE_API_URL || "http://localhost:5000", []);

  const fetchMoods = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to view your moods');

      const response = await fetch(`${API_URL}/api/moods`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.success) setMoodEntries(data.data || []);
      else throw new Error(data.message || 'Failed to load moods');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMoods(); }, []);

  const updateMoodEntry = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/api/moods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.success) {
        setMoodEntries(prev => prev.map(entry => entry._id === id ? { ...entry, ...data.data } : entry));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to update mood' };
    }
  };

  const deleteMoodEntry = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/moods/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.success) {
        setMoodEntries(prev => prev.filter(entry => entry._id !== id));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Failed to delete mood' };
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-8"><div className="flex items-center space-x-3"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div><div className="text-white">Loading moods...</div></div></div>;
  if (error) return <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400"><strong>Error:</strong> {error}<button onClick={fetchMoods} className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm">Retry</button></div>;

  return (
    <div className="space-y-8">
      <MoodEntry onAddEntry={(newEntry) => setMoodEntries(prev => [newEntry, ...prev])} apiUrl={API_URL} />
      <MoodHistory moodEntries={moodEntries} onUpdateMood={updateMoodEntry} onDeleteMood={deleteMoodEntry} />
    </div>
  );
});

export default MoodTracker;