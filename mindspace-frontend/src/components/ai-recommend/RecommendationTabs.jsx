import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
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
      { icon: <Lightbulb className="w-5 h-5" />, text: "Take a mindful walk and notice 5 things around you", color: "blue" },
      { icon: <Activity className="w-5 h-5" />, text: "Stretch or do yoga for 10 minutes to release tension", color: "indigo" },
      { icon: <Heart className="w-5 h-5" />, text: "Write a short note encouraging yourself", color: "slate" },
      { icon: <Sparkles className="w-5 h-5" />, text: "Play your favorite song and dance for 3–5 minutes", color: "cyan" }
    ],
    gradient: "from-blue-600/20 to-indigo-600/20",
    border: "border-blue-400/40"
  },
  anxious: {
    title: "Calming Your Anxiety",
    tips: [
      { icon: <Lightbulb className="w-5 h-5" />, text: "Focus on a single task for 10 minutes to regain calm", color: "purple" },
      { icon: <Activity className="w-5 h-5" />, text: "Draw, doodle, or color freely without pressure", color: "indigo" },
      { icon: <Heart className="w-5 h-5" />, text: "Make a comforting cup of tea and savor it mindfully", color: "blue" },
      { icon: <Sparkles className="w-5 h-5" />, text: "Perform one small act of kindness for someone else", color: "pink" }
    ],
    gradient: "from-purple-600/20 to-indigo-600/20",
    border: "border-purple-400/40"
  },
  tired: {
    title: "Boosting Your Energy",
    tips: [
      { icon: <Zap className="w-5 h-5" />, text: "Step outside for sunlight or fresh air for 10 minutes", color: "amber" },
      { icon: <Activity className="w-5 h-5" />, text: "Do light stretching or quick body movements", color: "yellow" },
      { icon: <Heart className="w-5 h-5" />, text: "Hydrate and have a nutritious snack like fruits or nuts", color: "orange" },
      { icon: <Sparkles className="w-5 h-5" />, text: "Spend 5–10 minutes on a creative hobby", color: "yellow" }
    ],
    gradient: "from-amber-600/20 to-yellow-600/20",
    border: "border-amber-400/40"
  },
  happy: {
    title: "Amplifying Your Joy",
    tips: [
      { icon: <Heart className="w-5 h-5" />, text: "Share a heartwarming story with a friend", color: "green" },
      { icon: <Lightbulb className="w-5 h-5" />, text: "Reflect on 3 positive things from today", color: "emerald" },
      { icon: <Activity className="w-5 h-5" />, text: "Try a fun new activity or hobby", color: "teal" },
      { icon: <Sparkles className="w-5 h-5" />, text: "Take a short walk outdoors and enjoy the moment", color: "emerald" }
    ],
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
            <h3 className="text-3xl font-bold text-blue-50">Today's Personalized Advice</h3>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-8">
          <label className="block text-gray-200 font-bold mb-4">How are you feeling today?</label>
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
          
          <div className="mt-6 flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Personalized insights for your wellness</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTabs;
