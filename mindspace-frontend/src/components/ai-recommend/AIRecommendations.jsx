import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Brain } from 'lucide-react';
import AIInsightsCTA from './AIInsightsCTA';
import RecommendationTabs from './RecommendationTabs';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/wellness`
  : 'http://localhost:5000/api/wellness';

const AIRecommendations = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom when new message comes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChatMessage = async () => {
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    const userMessage = { role: 'user', content: trimmedMessage };
    const updatedChat = [...chatMessages, userMessage];

    setChatMessages(updatedChat);
    setChatInput('');
    setChatLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage, conversationHistory: updatedChat })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setError('AI service did not return a valid response.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to AI service. Make sure backend is running.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950/40 px-6 py-20 relative overflow-hidden">
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
            Your personal wellness companion—available 24/7 for support, guidance, and insights.
          </p>
        </div>

        {/* Recommendation Tabs */}
        <RecommendationTabs />

        {/* AI Wellness Coach */}
        <div className="bg-gradient-to-br from-slate-900/40 via-gray-900/40 to-blue-900/20 backdrop-blur-xl border border-slate-400/30 rounded-3xl p-8 shadow-2xl shadow-slate-900/10 hover:shadow-blue-500/10 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-slate-600/30 to-blue-600/30 rounded-2xl mr-4">
                <MessageSquare className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Wellness Coach</h3>
                <p className="text-gray-300 text-sm">24/7 personalized support & guidance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">Online</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-yellow-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          {!chatOpen ? (
            <>
              {/* Intro & features */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-4">
                  <p className="text-gray-100 leading-relaxed">
                    "I'm your personal wellness companion, available anytime you need support. I can help with stress management, goal setting, mindfulness practices, and more."
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {['💬 Instant Responses', '🎯 Personalized Tips', '🔒 Private & Secure'].map((feature, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                      <span className="text-2xl mb-1 block">{feature.split(' ')[0]}</span>
                      <span className="text-gray-200 text-sm font-medium">{feature.substring(3)}</span>
                    </div>
                  ))}
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
            <>
              {/* Chat box */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4 h-96 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Start a conversation! How are you feeling today?</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-gray-100'}`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef}></div>
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 text-gray-100 rounded-2xl p-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {chatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>

                <button onClick={() => setChatOpen(false)} className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors">
                  Close Chat
                </button>
              </div>
            </>
          )}
        </div>

        {/* AI Insights CTA */}
        <div className="mt-16">
          <AIInsightsCTA />
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
