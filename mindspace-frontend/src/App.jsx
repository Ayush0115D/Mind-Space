import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import MoodTracker from './components/mood/MoodTracker';
import GoalsHabitsTracker from './components/goals/GoalsHabitsTracker';
import ResourceHub from './components/resources/ResourceHub';
import AIRecommendations from './components/ai-recommend/AIRecommendations';
import LoginPage from './components/auth/LoginPage';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-5800 via-gray-800 to-gray-900">
      <Header user={user} onLogout={handleLogout} />
      <div className="w-full px-8 sm:px-12 lg:px-24 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-1">
            {currentView === 'dashboard' && <Dashboard user={user} />}
            {currentView === 'mood' && <MoodTracker user={user} />}
            {currentView === 'goals' && <GoalsHabitsTracker user={user} />}
            {currentView === 'resources' && <ResourceHub user={user} />}
            {currentView === 'ai-recommend' && <AIRecommendations user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;