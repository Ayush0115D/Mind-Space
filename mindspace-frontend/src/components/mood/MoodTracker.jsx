import React, { useState } from 'react';
import MoodEntry from './MoodEntry';
import MoodHistory from './MoodHistory';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([
    { date: '2025-09-03', mood: 4, note: 'Feeling positive' },
    { date: '2025-09-02', mood: 3, note: 'Regular Tuesday' },
    { date: '2025-09-01', mood: 4, note: 'Productive Monday' }
  ]);

  const addMoodEntry = (newEntry) => {
    setMoodEntries([newEntry, ...moodEntries]);
  };

  return (
    <div className="space-y-8">
      <MoodEntry onAddEntry={addMoodEntry} />
      <MoodHistory entries={moodEntries} />
    </div>
  );
};

export default MoodTracker;