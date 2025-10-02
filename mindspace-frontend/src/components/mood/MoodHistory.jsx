import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Edit, Trash2 } from 'lucide-react';

const MOOD_COLORS = { 1: 'bg-red-500', 2: 'bg-orange-500', 3: 'bg-yellow-500', 4: 'bg-green-500', 5: 'bg-emerald-500' };
const MOOD_LABELS = { 1: 'Very Poor', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent' };
const MOOD_EMOJIS = { 1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '😄' };

const MoodEntryItem = React.memo(({ entry, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMood, setEditMood] = useState(entry.mood);
  const [editNote, setEditNote] = useState(entry.note || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    const result = await onUpdate(entry._id, { mood: editMood, note: editNote.trim() });
    setLoading(false);
    result.success ? setIsEditing(false) : alert(result.message);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this mood?') || loading) return;
    setLoading(true);
    const result = await onDelete(entry._id);
    setLoading(false);
    if (!result.success) alert(result.message);
  };

  const formatDate = (d) => {
    if (!d) return 'No date';
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return 'Invalid date';

      const now = new Date();
      const today = now.toDateString();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

      const timeStr = date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      if (date.toDateString() === today) return `Today, ${timeStr}`;
      if (date.toDateString() === yesterday) return `Yesterday, ${timeStr}`;

      const dateStr = date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      return `${dateStr}, ${timeStr}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date error';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-slate-900/80 rounded-lg p-4 border-2 border-purple-600/50 space-y-3">
        <label className="text-sm text-white">Mood: {editMood}/5</label>
        <input type="range" min="1" max="5" value={editMood} onChange={(e) => setEditMood(+e.target.value)} className="w-full accent-purple-500" />
        <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} rows="2" className="w-full p-2 bg-slate-800 rounded text-white text-sm" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-800/50 hover:border-slate-700/50 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-full ${MOOD_COLORS[entry.mood]} flex items-center justify-center text-white font-bold`}>{entry.mood}</div>
          <div className="text-2xl">{MOOD_EMOJIS[entry.mood]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 text-sm text-slate-400">
              <span className="font-medium text-white">{MOOD_LABELS[entry.mood]}</span>
              • <span>{formatDate(entry.date)}</span>
            </div>
            {entry.note && <p className="text-slate-300 text-sm">{entry.note}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i < entry.mood ? MOOD_COLORS[entry.mood] : 'bg-slate-700'}`} />)}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400"><Edit className="w-4 h-4" /></button>
            <button onClick={handleDelete} disabled={loading} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
});

const MoodHistory = React.memo(({ moodEntries = [], onUpdateMood, onDeleteMood }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const { filteredEntries, stats } = useMemo(() => {
    if (!moodEntries.length) return { filteredEntries: [], stats: { average: 0, trend: 'stable' } };

    const now = new Date(), cutoffDate = new Date();
    if (selectedPeriod === 'week') cutoffDate.setDate(now.getDate() - 7);
    else if (selectedPeriod === 'month') cutoffDate.setMonth(now.getMonth() - 1);
    else if (selectedPeriod === 'year') cutoffDate.setFullYear(now.getFullYear() - 1);

    // Filter and sort entries by date (most recent first)
    const filtered = moodEntries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const average = filtered.length ? (filtered.reduce((acc, e) => acc + e.mood, 0) / filtered.length).toFixed(1) : 0;

    let trend = 'stable';
    if (filtered.length >= 4) {
      // Compare the 2 most recent entries with the 2 oldest entries in the period
      const recentCount = Math.min(2, Math.floor(filtered.length / 2));
      const recent = filtered.slice(0, recentCount);
      const older = filtered.slice(-recentCount);
      
      const rAvg = recent.reduce((a, e) => a + e.mood, 0) / recent.length;
      const oAvg = older.reduce((a, e) => a + e.mood, 0) / older.length;
      
      // Use a threshold of 0.5 for clearer trend detection
      if (rAvg > oAvg + 0.5) trend = 'improving';
      else if (rAvg < oAvg - 0.5) trend = 'declining';
    }

    return { filteredEntries: filtered, stats: { average, trend } };
  }, [moodEntries, selectedPeriod]);

  const trendIcon = stats.trend === 'improving' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
    stats.trend === 'declining' ? <TrendingDown className="w-5 h-5 text-red-400" /> : <Minus className="w-5 h-5 text-yellow-400" />;
  const trendEmoji = stats.trend === 'improving' ? '📈' : stats.trend === 'declining' ? '📉' : '➡️';

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-700/20 rounded-lg"><Calendar className="w-6 h-6 text-purple-400" /></div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mood History</h2>
              <p className="text-slate-400 text-sm">Track your emotional journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map(period => (
              <button key={period} onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period ? 'bg-purple-700 text-white' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'}`}>
                {period[0].toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredEntries.length ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.average}</div>
              <div className="text-sm text-slate-400">Average Mood</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="flex items-center gap-2 text-2xl font-bold text-white">{filteredEntries.length}{trendIcon}</div>
              <div className="text-sm text-slate-400">Total Entries</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{trendEmoji}</div>
              <div className="text-sm text-slate-400 capitalize">{stats.trend} Trend</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No mood entries for {selectedPeriod}</h3>
          </div>
        )}
      </div>

      {!!filteredEntries.length && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Entries</h3>
            <p className="text-sm text-slate-400 italic">Hover to edit or delete</p>
          </div>
          {filteredEntries.map(entry => <MoodEntryItem key={entry._id} entry={entry} onUpdate={onUpdateMood} onDelete={onDeleteMood} />)}
        </div>
      )}
    </div>
  );
});

export default MoodHistory;