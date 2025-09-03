import React, { useState } from 'react';
import JournalEditor from './JournalEditor';
import JournalEntry from './JournalEntry';

const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2025-09-03',
      title: 'Reflection on Progress',
      content: 'Today I realized how much I\'ve grown over the past month.',
      sentiment: 'positive'
    }
  ]);

  const addEntry = (newEntry) => {
    setEntries([{ ...newEntry, id: Date.now() }, ...entries]);
  };

  return (
    <div className="space-y-8">
      <JournalEditor onAddEntry={addEntry} />
      <div className="space-y-6">
        {entries.map((entry) => (
          <JournalEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default Journal;