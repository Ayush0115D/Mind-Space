import React, { useState } from 'react';
import MoodEntry from './MoodEntry';
import MoodHistory from './MoodHistory';

const MoodTracker = () => {
  // Start with empty array - no dummy data
  const [moodEntries, setMoodEntries] = useState([]);

  const addMoodEntry = (newEntry) => {
    // Add timestamp when entry is created
    const entryWithTimestamp = {
      ...newEntry,
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    
    setMoodEntries([entryWithTimestamp, ...moodEntries]);
  };

  return (
    <div className="space-y-8">
      <MoodEntry onAddEntry={addMoodEntry} />
      <MoodHistory moodEntries={moodEntries} />
    </div>
  );
};

export default MoodTracker;