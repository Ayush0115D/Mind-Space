import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lightbulb,
  MessageSquare,
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Zap,
  Send,
  Loader2,
  Brain
} from 'lucide-react';

const AIRecommendations = () => {
  const [selectedMood, setSelectedMood] = useState('stressed');
  const [customTips, setCustomTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/wellness';

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

  // Fetch AI-generated tips when mood changes
  useEffect(() => {
    fetchMoodAdvice(selectedMood);
  }, [selectedMood]);

  const fetchMoodAdvice = async (mood) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/mood-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch advice');
      }

      const data = await response.json();
      
      if (data.success && data.tips) {
        const tipsWithIcons = data.tips.map(tip => ({
          ...tip,
          icon: getCategoryIcon(tip.category),
          color: getCategoryColor(tip.category)
        }));
        setCustomTips(tipsWithIcons);
      }
    } catch (error) {
      console.error('Error fetching mood advice:', error);
      setError('Could not load AI tips. Showing default tips.');
      setCustomTips(moodAdvice[mood].tips);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      mental: <Lightbulb className="w-5 h-5" />,
      physical: <Activity className="w-5 h-5" />,
      social: <Heart className="w-5 h-5" />
    };
    return icons[category] || <Lightbulb className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      mental: 'blue',
      physical: 'indigo',
      social: 'slate'
    };
    return colors[category] || 'blue';
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/wellness-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          conversationHistory: chatMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.success) {
        const aiMessage = { role: 'assistant', content: data.response };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running and try again." 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const currentAdvice = moodAdvice[selectedMood];

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950/40 px-6 py-20 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full mb-8 shadow-2xl shadow-blue-500/20">
            <Brain className="w-10 h-10 text-blue-300" />
          </div>
          <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-slate-300 bg-clip-text mb-6 leading-tight">
            Personalized Recommendations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover what works for you—personalized strategies backed by intelligent insights.
          </p>
        </div>

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

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-yellow-200 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Personalized Tips */}
            <div className={`bg-gradient-to-r ${currentAdvice.gradient} backdrop-blur-xl border ${currentAdvice.border} rounded-2xl p-6`}>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-300" />
                {currentAdvice.title}
              </h4>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <span className="ml-3 text-gray-200">Getting personalized advice from AI...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {(customTips.length > 0 ? customTips : currentAdvice.tips).map((tip, index) => (
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
              )}
              
              <div className="mt-6 flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Updated with AI insights</span>
                </div>
                <button 
                  onClick={() => fetchMoodAdvice(selectedMood)}
                  className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh Tips →'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Wellness Coach */}
          <div className="bg-gradient-to-br from-slate-900/40 via-gray-900/40 to-blue-900/20 backdrop-blur-xl border border-slate-400/30 rounded-3xl p-8 shadow-2xl shadow-slate-900/10 hover:shadow-blue-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-slate-600/30 to-blue-600/30 rounded-2xl mr-4">
                  <MessageSquare className="w-7 h-7 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
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

            {!chatOpen ? (
              <>
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

                <button 
                  onClick={() => setChatOpen(true)}
                  className="w-full bg-gradient-to-r from-slate-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-slate-700 hover:to-blue-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Chatting Now
                </button>
              </>
            ) : (
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="bg-gray-900/50 rounded-xl p-4 h-96 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Start a conversation! How are you feeling today?</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700/50 text-gray-100'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 text-gray-100 rounded-2xl p-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setChatOpen(false)}
                  className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
                >
                  Close Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-slate-600/20 backdrop-blur-xl border border-blue-400/40 rounded-3xl p-12 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400/30 to-yellow-400/30 rounded-2xl mb-6">
                <Brain className="w-8 h-8 text-amber-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Need More Personalized Insights?
              </h3>
              <p className="text-gray-200 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                Our advanced AI analyzes your wellness patterns, goals, and preferences to deliver hyper-personalized recommendations that evolve with your journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 border border-blue-400/20">
                  Unlock AI Insights
                </button>
                <button className="bg-gray-900/60 text-blue-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800/80 border-2 border-blue-500/30 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:text-white">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;