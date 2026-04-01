import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import MoodTracker from './components/mood/MoodTracker';
import GoalsHabitsTracker from './components/goals/GoalsHabitsTracker';
import ResourceHub from './components/resources/ResourceHub';
import AIRecommendations from './components/ai-recommend/AIRecommendations';
import Community from './components/community/Community'; // ✨ NEW
import LoginPage from './components/auth/LoginPage';
import { X, Heart, Smile, Meh, Frown, Laugh, AlertCircle } from 'lucide-react';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Low',  color: 'hover:border-red-500     hover:bg-red-500/20     group-hover:text-red-400' },
  { value: 2, emoji: '😕', label: 'Low',       color: 'hover:border-orange-500  hover:bg-orange-500/20  group-hover:text-orange-400' },
  { value: 3, emoji: '😐', label: 'Neutral',   color: 'hover:border-yellow-500  hover:bg-yellow-500/20  group-hover:text-yellow-400' },
  { value: 4, emoji: '😊', label: 'Good',      color: 'hover:border-green-500   hover:bg-green-500/20   group-hover:text-green-400' },
  { value: 5, emoji: '😄', label: 'Excellent', color: 'hover:border-emerald-500 hover:bg-emerald-500/20 group-hover:text-emerald-400' },
];

const CheckInPopup = ({ onClose, onSubmit, isSubmitting }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSubmit = () => {
    if (!selectedMood) return;
    onSubmit(selectedMood);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-purple-700/40 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-purple-900/30 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-7">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-md" />
            <div className="relative w-16 h-16 rounded-full border-2 border-pink-500/50 bg-gray-900 flex items-center justify-center shadow-lg shadow-pink-900/30">
              <div className="absolute inset-0 rounded-full border border-pink-400/30 animate-ping" />
              <Heart className="w-7 h-7 text-pink-400 fill-pink-400/30" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Good to see you! 👋</h2>
          <p className="text-gray-400 text-sm">How are you feeling right now?</p>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-7">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              className={`group flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200
                ${selectedMood === m.value
                  ? 'border-purple-500 bg-purple-500/20 scale-105'
                  : `border-gray-700 bg-gray-800/50 ${m.color}`
                }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className={`text-xs font-medium transition-colors ${selectedMood === m.value ? 'text-purple-300' : 'text-gray-400'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium">
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
          >
            {isSubmitting ? 'Saving...' : 'Log Mood ✨'}
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);

  const API_URL = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000', []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => setShowCheckIn(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
    setShowCheckIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleCheckInSubmit = useCallback(async (moodValue) => {
    setIsSubmittingMood(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ mood: moodValue, note: 'Daily check-in', date: new Date().toISOString() })
      });
      if (response.ok) setShowCheckIn(false);
    } catch (err) {
      console.error('Check-in save failed:', err);
    } finally {
      setIsSubmittingMood(false);
      setShowCheckIn(false);
    }
  }, [API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-5800 via-gray-800 to-gray-900">
      {showCheckIn && (
        <CheckInPopup
          onClose={() => setShowCheckIn(false)}
          onSubmit={handleCheckInSubmit}
          isSubmitting={isSubmittingMood}
        />
      )}
      <Header user={user} onLogout={handleLogout} />
      <div className="w-full px-8 sm:px-12 lg:px-24 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-1">
            {currentView === 'dashboard'    && <Dashboard user={user} />}
            {currentView === 'mood'         && <MoodTracker user={user} />}
            {currentView === 'goals'        && <GoalsHabitsTracker user={user} />}
            {currentView === 'resources'    && <ResourceHub user={user} />}
            {currentView === 'ai-recommend' && <AIRecommendations user={user} />}
            {currentView === 'community'    && <Community user={user} />} {/* ✨ NEW */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;