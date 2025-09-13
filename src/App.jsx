import React, { useState } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import MoodTracker from './components/mood/MoodTracker';
import Journal from './components/journal/Journal';
import Community from './components/community/Community';
import LoginPage from './components/auth/LoginPage';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    // Handle successful login
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    // Handle logout
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header user={user} onLogout={handleLogout} />
      {/* Small padding for breathing space */}
      <div className="w-full px-8 sm:px-12 lg:px-24 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-1">
            {currentView === 'dashboard' && <Dashboard user={user} />}
            {currentView === 'mood' && <MoodTracker user={user} />}
            {currentView === 'journal' && <Journal user={user} />}
            {currentView === 'community' && <Community user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;