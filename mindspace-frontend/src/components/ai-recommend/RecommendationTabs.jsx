import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  BookmarkPlus,
  Award,
  Activity,
  PlayCircle,
  ExternalLink,
  Calendar,
  MessageSquare
} from 'lucide-react';

const RecommendationTabs = () => {
  const [activeTab, setActiveTab] = useState('ai-picks');

  const aiRecommendations = [
    {
      id: 1,
      title: "Mindful Morning Routines for Busy Professionals",
      type: "guided-plan",
      duration: "21 days",
      match: 92,
      category: "stress",
      description: "Based on your stress patterns, this plan helps you start each day with intention and calm.",
      icon: <Sparkles className="w-6 h-6" />,
      colorClasses: "from-blue-600/20 to-indigo-600/20",
      borderClasses: "border-blue-400/30"
    },
    {
      id: 2,
      title: "Building Emotional Resilience Workshop",
      type: "workshop",
      duration: "3 hours",
      match: 89,
      category: "growth",
      description: "Interactive sessions designed to strengthen your emotional foundation.",
      icon: <Award className="w-6 h-6" />,
      colorClasses: "from-indigo-600/20 to-slate-600/20",
      borderClasses: "border-indigo-400/30"
    },
    {
      id: 3,
      title: "Sleep Optimization Program",
      type: "program",
      duration: "14 days",
      match: 87,
      category: "wellness",
      description: "Personalized sleep improvement plan based on your mood and activity data.",
      icon: <Activity className="w-6 h-6" />,
      colorClasses: "from-slate-600/20 to-blue-600/20",
      borderClasses: "border-slate-400/30"
    }
  ];

  const trendingContent = [
    {
      title: "The Science of Micro-Meditations",
      type: "article",
      engagement: "12.8K views",
      trend: "+45%"
    },
    {
      title: "Digital Detox Strategies That Work",
      type: "video",
      engagement: "8.2K views",
      trend: "+67%"
    },
    {
      title: "Community Support Circle",
      type: "live-session",
      engagement: "Live now",
      trend: "🔴 Live"
    }
  ];

  const savedContent = [
    { title: "Anxiety Management Techniques", type: "article", savedDate: "2 days ago" },
    { title: "Relationship Communication Skills", type: "video", savedDate: "1 week ago" },
    { title: "Career Burnout Recovery Guide", type: "podcast", savedDate: "2 weeks ago" }
  ];

  const getTabButtonClasses = (tabName, baseColors) => {
    const isActive = activeTab === tabName;
    const baseClasses = "flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300";
    
    if (isActive) {
      return `${baseClasses} ${baseColors.active} text-white shadow-2xl transform scale-105 border-2`;
    }
    
    return `${baseClasses} bg-gray-900/60 text-gray-300 hover:bg-gray-800/70 border-2 ${baseColors.inactive} hover:text-white backdrop-blur-xl`;
  };

  const getTrendBadgeClasses = (trend) => {
    if (trend.includes('Live')) {
      return 'bg-red-500/20 text-red-300';
    }
    return 'bg-amber-500/20 text-amber-300';
  };

  const renderAIPicksContent = () => (
    <div className="space-y-6">
      {aiRecommendations.map((rec) => (
        <div 
          key={rec.id} 
          className={`bg-gradient-to-r ${rec.colorClasses} backdrop-blur-xl border ${rec.borderClasses} rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-amber-300">
                    {rec.match}% Match
                  </span>
                  <span className="text-gray-300 capitalize font-medium">{rec.type}</span>
                  <span className="text-gray-400">{rec.duration}</span>
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors mb-2">
                  {rec.title}
                </h4>
                <p className="text-gray-200 leading-relaxed">{rec.description}</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105">
              Start Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrendingContent = () => (
    <div className="grid gap-6">
      {trendingContent.map((item, index) => (
        <div key={index} className="bg-gray-800/50 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <PlayCircle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 capitalize font-medium">{item.type}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTrendBadgeClasses(item.trend)}`}>
                {item.trend}
              </span>
            </div>
            <span className="text-gray-400 text-sm">{item.engagement}</span>
          </div>
          <h4 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
            {item.title}
          </h4>
        </div>
      ))}
    </div>
  );

  const renderSavedContent = () => (
    <div className="grid gap-4">
      {savedContent.map((item, index) => (
        <div key={index} className="bg-gray-800/50 border border-blue-500/30 rounded-2xl p-5 hover:border-blue-400/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookmarkPlus className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-blue-300 capitalize text-sm">{item.type}</span>
                  <span className="text-gray-400 text-sm">• Saved {item.savedDate}</span>
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );

  const tabContent = {
    'ai-picks': renderAIPicksContent(),
    'trending': renderTrendingContent(),
    'saved': renderSavedContent()
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 via-gray-900/40 to-slate-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8 shadow-2xl shadow-blue-900/10 mb-20">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('ai-picks')}
          className={getTabButtonClasses('ai-picks', {
            active: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30 border-blue-400/50',
            inactive: 'border-blue-500/30 hover:border-blue-500/50'
          })}
        >
          <Sparkles className="w-5 h-5 mr-3" />
          AI Picks
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={getTabButtonClasses('trending', {
            active: 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/30 border-amber-400/50',
            inactive: 'border-amber-500/30 hover:border-amber-500/50'
          })}
        >
          <TrendingUp className="w-5 h-5 mr-3" />
          Trending
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={getTabButtonClasses('saved', {
            active: 'bg-gradient-to-r from-slate-500 to-blue-500 shadow-slate-500/30 border-slate-400/50',
            inactive: 'border-slate-500/30 hover:border-slate-500/50'
          })}
        >
          <BookmarkPlus className="w-5 h-5 mr-3" />
          Saved
        </button>
      </div>

      {/* Tab Content */}
      {tabContent[activeTab]}

      {/* Additional Features */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-400/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-blue-400 mr-3" />
            <h4 className="text-xl font-bold text-blue-200">Weekly Check-ins</h4>
          </div>
          <p className="text-gray-200 mb-4 leading-relaxed">
            Get personalized insights based on your mood patterns and progress tracking.
          </p>
          <button className="text-blue-300 hover:text-blue-200 font-semibold transition-colors group-hover:translate-x-1 transition-transform">
            Schedule Now →
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-slate-600/10 to-blue-600/10 border border-slate-400/30 rounded-2xl p-6 hover:border-slate-400/50 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-6 h-6 text-slate-400 mr-3" />
            <h4 className="text-xl font-bold text-slate-200">AI Wellness Coach</h4>
          </div>
          <p className="text-gray-200 mb-4 leading-relaxed">
            24/7 AI companion for instant support, guidance, and personalized wellness tips.
          </p>
          <button className="text-slate-300 hover:text-slate-200 font-semibold transition-colors group-hover:translate-x-1 transition-transform">
            Chat Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTabs;