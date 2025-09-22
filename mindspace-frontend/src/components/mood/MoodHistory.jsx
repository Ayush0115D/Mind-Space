import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, Edit, Trash2 } from 'lucide-react';

const MoodEntryItem = React.memo(({ entry, moodColors, moodLabels, moodEmojis, formatDate, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMood, setEditMood] = useState(entry.mood);
  const [editNote, setEditNote] = useState(entry.note || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await onUpdate(entry._id, { mood: editMood, note: editNote });
    setLoading(false);
    result.success ? setIsEditing(false) : alert(result.message);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this mood?')) return;
    setLoading(true);
    const result = await onDelete(entry._id);
    setLoading(false);
    if (!result.success) alert(result.message);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800/60 rounded-lg p-4 border-2 border-purple-500/50 space-y-3">
        <label className="text-sm text-white">Mood: {editMood}/5</label>
        <input type="range" min="1" max="5" value={editMood} onChange={(e) => setEditMood(+e.target.value)} className="w-full accent-purple-500" />
        <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} rows="2"
          className="w-full p-2 bg-slate-700 rounded text-white text-sm" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-full ${moodColors[entry.mood]} flex items-center justify-center text-white font-bold`}>
            {entry.mood}
          </div>
          <div className="text-2xl">{moodEmojis[entry.mood]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 text-sm text-slate-400">
              <span className="font-medium text-white">{moodLabels[entry.mood]}</span>
              • <span>{formatDate(entry.date)}</span>
              {entry.timestamp && <>• <span>{entry.timestamp}</span></>}
            </div>
            {entry.note && <p className="text-slate-300 text-sm">{entry.note}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < entry.mood ? moodColors[entry.mood] : 'bg-slate-600'}`} />
            ))}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} disabled={loading} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const MoodHistory = ({ moodEntries = [], onUpdateMood, onDeleteMood }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const moodColors = useMemo(() => ({
    1: 'bg-red-500', 2: 'bg-orange-500', 3: 'bg-yellow-500', 4: 'bg-green-500', 5: 'bg-emerald-500'
  }), []);
  const moodLabels = useMemo(() => ({
    1: 'Very Poor', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent'
  }), []);
  const moodEmojis = useMemo(() => ({
    1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '😄'
  }), []);

  const average = useMemo(() => moodEntries.length
    ? (moodEntries.reduce((acc, e) => acc + e.mood, 0) / moodEntries.length).toFixed(1)
    : 0, [moodEntries]);

  const trend = useMemo(() => {
    if (moodEntries.length < 2) return 'stable';
    const recent = moodEntries.slice(-3), older = moodEntries.slice(-6, -3);
    const rAvg = recent.reduce((a, e) => a + e.mood, 0) / recent.length;
    const oAvg = older.length ? older.reduce((a, e) => a + e.mood, 0) / older.length : rAvg;
    if (rAvg > oAvg + 0.5) return 'improving';
    if (rAvg < oAvg - 0.5) return 'declining';
    return 'stable';
  }, [moodEntries]);

  const formatDate = (d) => {
    const date = new Date(d), today = new Date(), yest = new Date();
    yest.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yest.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg"><Calendar className="w-6 h-6 text-purple-400" /></div>
            <div>
              <h2 className="text-xl font-semibold text-white">Mood History</h2>
              <p className="text-slate-400 text-sm">Track your emotional journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((p) => (
              <button key={p} onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === p ? 'bg-purple-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {moodEntries.length ? (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Average Mood', value: average },
              {
                label: 'Total Entries',
                value: moodEntries.length,
                icon: trend === 'improving' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                      trend === 'declining' ? <TrendingDown className="w-5 h-5 text-red-400" /> :
                      <Minus className="w-5 h-5 text-yellow-400" />
              },
              {
                label: `${trend} Trend`,
                value: trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'
              }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                  {stat.value}{stat.icon}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No mood entries yet</h3>
            <p className="text-slate-400 text-sm">Start tracking your mood to see statistics</p>
          </div>
        )}
      </div>

      {/* Mood List */}
      {!!moodEntries.length && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Entries</h3>
            <p className="text-sm text-slate-400">Hover to edit/delete</p>
          </div>
          {moodEntries.map((e) => (
            <MoodEntryItem key={e._id} entry={e}
              moodColors={moodColors} moodLabels={moodLabels} moodEmojis={moodEmojis}
              formatDate={formatDate} onUpdate={onUpdateMood} onDelete={onDeleteMood} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
