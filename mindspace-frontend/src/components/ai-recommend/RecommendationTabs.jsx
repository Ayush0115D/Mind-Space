import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  MessageSquare,
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Zap
} from 'lucide-react';

const RecommendationTabs = () => {
  const [selectedMood, setSelectedMood] = useState('stressed');

  const moodAdvice = {
    stressed: {
      title: "Managing Stress Today",
      tips: [
        { icon: <Lightbulb className="w-5 h-5" />, text: "Take 5 deep breaths every hour", color: "blue" },
        { icon: <Activity className="w-5 h-5" />, text: "Try a 10-minute walk during lunch", color: "indigo" },
        { icon: <Heart className="w-5 h-5" />, text: "Practice progressive muscle relaxation", color: "slate" }
      ],
      color: "blue",
      gradient: "from-blue-600/20 to-indigo-600/20",
      border: "border-blue-400/40"
    },
    anxious: {
      title: "Calming Your Anxiety",
      tips: [
        { icon: <Lightbulb className="w-5 h-5" />, text: "Ground yourself with the 5-4-3-2-1 technique", color: "purple" },
        { icon: <Activity className="w-5 h-5" />, text: "Write down your worries for 5 minutes", color: "indigo" },
        { icon: <Heart className="w-5 h-5" />, text: "Listen to calming music or nature sounds", color: "blue" }
      ],
      color: "purple",
      gradient: "from-purple-600/20 to-indigo-600/20",
      border: "border-purple-400/40"
    },
    tired: {
      title: "Boosting Your Energy",
      tips: [
        { icon: <Zap className="w-5 h-5" />, text: "Get 15 minutes of sunlight exposure", color: "amber" },
        { icon: <Activity className="w-5 h-5" />, text: "Stay hydrated - drink water every hour", color: "yellow" },
        { icon: <Heart className="w-5 h-5" />, text: "Take a power nap (20 minutes max)", color: "orange" }
      ],
      color: "amber",
      gradient: "from-amber-600/20 to-yellow-600/20",
      border: "border-amber-400/40"
    },
    happy: {
      title: "Amplifying Your Joy",
      tips: [
        { icon: <Heart className="w-5 h-5" />, text: "Share your positivity with someone", color: "green" },
        { icon: <Lightbulb className="w-5 h-5" />, text: "Journal about what's going well", color: "emerald" },
        { icon: <Activity className="w-5 h-5" />, text: "Try something new or creative today", color: "teal" }
      ],
      color: "green",
      gradient: "from-green-600/20 to-emerald-600/20",
      border: "border-green-400/40"
    }
  };

  const moods = [
    { value: 'stressed', label: 'Stressed', emoji: '😰', color: 'blue' },
    { value: 'anxious', label: 'Anxious', emoji: '😟', color: 'purple' },
    { value: 'tired', label: 'Tired', emoji: '😴', color: 'amber' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'green' }
  ];

  const currentAdvice = moodAdvice[selectedMood];

  return (
    <div className="space-y-8">
      {/* Today's Personalized Advice */}
      <div className="bg-gradient-to-br from-blue-900/20 via-gray-900/40 to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8 shadow-2xl shadow-blue-900/10">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-600/20 rounded-2xl mr-4">
            <Sparkles className="w-7 h-7 text-blue-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Today's Personalized Advice</h3>
            <p className="text-gray-300 text-sm">Based on your current mood and patterns</p>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-8">
          <label className="block text-gray-200 font-semibold mb-4">How are you feeling today?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMood === mood.value
                    ? `bg-${mood.color}-600/20 border-${mood.color}-400/60 shadow-lg shadow-${mood.color}-500/20 scale-105`
                    : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70'
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className={`font-semibold ${
                  selectedMood === mood.value ? `text-${mood.color}-200` : 'text-gray-300'
                }`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Tips */}
        <div className={`bg-gradient-to-r ${currentAdvice.gradient} backdrop-blur-xl border ${currentAdvice.border} rounded-2xl p-6`}>
          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-300" />
            {currentAdvice.title}
          </h4>
          <div className="space-y-4">
            {currentAdvice.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className={`p-2 bg-${tip.color}-600/20 rounded-lg text-${tip.color}-300 group-hover:scale-110 transition-transform`}>
                  {tip.icon}
                </div>
                <p className="text-gray-100 flex-1 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Updated daily at 6:00 AM</span>
            </div>
            <button className="text-blue-300 hover:text-blue-200 font-semibold transition-colors">
              View More Tips →
            </button>
          </div>
        </div>
      </div>

      {/* AI Wellness Coach */}
      <div className="bg-gradient-to-br from-slate-900/40 via-gray-900/40 to-blue-900/20 backdrop-blur-xl border border-slate-400/30 rounded-3xl p-8 shadow-2xl shadow-slate-900/10 hover:shadow-blue-500/10 transition-all duration-500 group cursor-pointer">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-slate-600/30 to-blue-600/30 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                AI Wellness Coach
              </h3>
              <p className="text-gray-300 text-sm">24/7 personalized support & guidance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">Online</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-4">
            <p className="text-gray-100 leading-relaxed">
              "I'm your personal wellness companion, available anytime you need support. I can help with stress management, goal setting, mindfulness practices, and more."
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
              <span className="text-2xl mb-1 block">💬</span>
              <span className="text-gray-200 text-sm font-medium">Instant Responses</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
              <span className="text-2xl mb-1 block">🎯</span>
              <span className="text-gray-200 text-sm font-medium">Personalized Tips</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
              <span className="text-2xl mb-1 block">🔒</span>
              <span className="text-gray-200 text-sm font-medium">Private & Secure</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-slate-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-slate-700 hover:to-blue-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Chatting Now
        </button>
      </div>
    </div>
  );
};

export default RecommendationTabs;