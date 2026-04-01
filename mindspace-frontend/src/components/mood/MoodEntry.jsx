import React, { useState, useCallback, useMemo } from 'react';
import { Heart, Plus, Brain, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const SENTIMENT_CONFIG = {
  very_positive: { emoji: '😄', label: 'Very Positive', color: 'emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  positive:      { emoji: '😊', label: 'Positive',      color: 'green',   bg: 'bg-green-500/15',   border: 'border-green-500/40',   text: 'text-green-400',   bar: 'bg-green-500' },
  neutral:       { emoji: '😐', label: 'Neutral',       color: 'yellow',  bg: 'bg-yellow-500/15',  border: 'border-yellow-500/40',  text: 'text-yellow-400',  bar: 'bg-yellow-500' },
  negative:      { emoji: '😕', label: 'Negative',      color: 'orange',  bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  text: 'text-orange-400',  bar: 'bg-orange-500' },
  very_negative: { emoji: '😢', label: 'Very Negative', color: 'red',     bg: 'bg-red-500/15',     border: 'border-red-500/40',     text: 'text-red-400',     bar: 'bg-red-500' },
};

const SentimentCard = ({ result, autoSaved }) => {
  const config = SENTIMENT_CONFIG[result.sentiment] || SENTIMENT_CONFIG.neutral;
  const score = Math.round(result.confidence * 100);

  return (
    <div className={`rounded-2xl p-5 border ${config.bg} ${config.border} space-y-4 transition-all duration-500`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">AI Detected Mood</p>
            <p className={`text-lg font-bold ${config.text}`}>{config.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-1">Confidence</p>
          <p className={`text-2xl font-bold ${config.text}`}>{score}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${config.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>

      {/* AI Summary */}
      {result.summary && (
        <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
          {result.summary}
        </p>
      )}

      {/* Suggested Resources */}
      {result.suggestions?.length > 0 && (
        <div className="border-t border-slate-700/50 pt-3">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">Suggested for you</p>
          <div className="flex flex-wrap gap-2">
            {result.suggestions.map((s, i) => (
              <span key={i} className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.text} border ${config.border} font-medium`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Auto-saved badge */}
      {autoSaved && (
        <div className="flex items-center gap-2 border-t border-slate-700/50 pt-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Saved to Mood History automatically</span>
        </div>
      )}
    </div>
  );
};

const MoodEntry = React.memo(({ onAddEntry, apiUrl }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // AI Journal states
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [analyzeError, setAnalyzeError] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);

  const API_URL = useMemo(() =>
    apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:5000', [apiUrl]
  );

  const sliderStyle = useMemo(() => ({
    background: `linear-gradient(to right, #8b5cf6 ${(mood - 1) * 25}%, #374151 ${(mood - 1) * 25}%)`
  }), [mood]);

  // Auto-save mood entry to history
  const autoSaveMood = useCallback(async (suggestedMood, journalNote) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: suggestedMood,
          note: journalNote,
          date: new Date().toISOString()
        })
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success) {
        // Add to mood history immediately
        onAddEntry({
          _id: data.data._id,
          mood: suggestedMood,
          note: journalNote,
          date: data.data.date,
          ...data.data
        });
        setAutoSaved(true);
      }
    } catch (err) {
      console.error('Auto-save failed:', err.message);
    }
  }, [API_URL, onAddEntry]);

  // AI Analyze Journal
  const handleAnalyze = useCallback(async () => {
    if (!journalText.trim() || isAnalyzing) return;
    if (journalText.trim().length < 10) {
      setAnalyzeError('Please write at least a few words for analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError('');
    setSentimentResult(null);
    setAutoSaved(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to analyze your journal');

      const response = await fetch(`${API_URL}/api/moods/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: journalText.trim() })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSentimentResult(data.data);

        const detectedMood = data.data.suggestedMood || 3;
        setMood(detectedMood);

        // ✅ Auto-save journal entry to mood history immediately
        await autoSaveMood(detectedMood, journalText.trim());

        // Clear journal after save
        setJournalText('');
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (err) {
      setAnalyzeError(err.message || 'Failed to analyze journal');
    } finally {
      setIsAnalyzing(false);
    }
  }, [API_URL, journalText, isAnalyzing, autoSaveMood]);

  // Manual mood submit (existing flow unchanged)
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to submit mood');

      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: parseInt(mood),
          note: note.trim(),
          date: new Date().toISOString()
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
          date: data.data.date,
          ...data.data
        });
        setMood(3);
        setNote('');
      } else {
        setError(data.message || 'Failed to save mood');
      }
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    } finally {
      setIsSubmitting(false);
    }
  }, [API_URL, mood, note, onAddEntry, isSubmitting]);

  return (
    <div className="space-y-5">
      {/* Existing Mood Slider Card */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <Heart className="w-7 h-7 text-pink-400" />
          <span>How are you feeling today?</span>
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-4">
              Mood Level: <span className="text-purple-400 text-xl">{mood}/5</span>
            </label>
            <input
              type="range" min="1" max="5" value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer appearance-none accent-pink-500"
              style={sliderStyle}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Very Low</span><span>Low</span><span>Neutral</span><span>Good</span><span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-3">Add a note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's influencing your mood today?"
              className="w-full p-4 bg-gray-800/60 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>{isSubmitting ? 'Saving...' : 'Submit Mood'}</span>
          </button>
        </div>
      </div>

      {/* ✨ AI Journal Section */}
      <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-600/20 rounded-xl">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              AI Mood Journal
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h3>
            <p className="text-slate-400 text-sm">Write freely — AI detects mood & saves to history automatically</p>
          </div>
        </div>

        <div className="space-y-4 mt-5">
          <textarea
            value={journalText}
            onChange={(e) => {
              setJournalText(e.target.value);
              setSentimentResult(null);
              setAnalyzeError('');
              setAutoSaved(false);
            }}
            placeholder="Express yourself freely... e.g. 'I've been feeling overwhelmed with work lately...'"
            className="w-full p-4 bg-gray-800/60 border border-gray-600 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-500 transition-all resize-none leading-relaxed"
            rows="5"
            disabled={isAnalyzing}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{journalText.length} characters</span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || journalText.trim().length < 10}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAnalyzing
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing & Saving...</span></>
                : <><Brain className="w-4 h-4" /><span>Analyze with AI</span></>
              }
            </button>
          </div>

          {analyzeError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{analyzeError}</span>
            </div>
          )}

          {sentimentResult && <SentimentCard result={sentimentResult} autoSaved={autoSaved} />}
        </div>
      </div>
    </div>
  );
});

MoodEntry.displayName = 'MoodEntry';
export default MoodEntry;