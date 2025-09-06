import React, { useState } from 'react';
import { Save, Calendar, Hash, Smile, Frown, Meh } from 'lucide-react';

const JournalEditor = ({ onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('neutral');
  const [isExpanded, setIsExpanded] = useState(false);

  const sentimentOptions = [
    { value: 'positive', icon: Smile, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Positive' },
    { value: 'neutral', icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Neutral' },
    { value: 'negative', icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Negative' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddEntry({
        title: title.trim(),
        content: content.trim(),
        sentiment: selectedSentiment,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedSentiment('neutral');
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    if (!title.trim() && !content.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Hash className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">New Journal Entry</h2>
            <p className="text-sm text-slate-400">Capture your thoughts and feelings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={handleFocus}
              placeholder="Entry title..."
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              maxLength={100}
            />
          </div>

          {/* Content Textarea */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleCancel}
              placeholder="Write about your day, thoughts, feelings, or experiences..."
              className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              rows={isExpanded ? 6 : 3}
              maxLength={2000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
              {content.length}/2000
            </div>
          </div>

          {/* Expanded Options */}
          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Sentiment Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  How are you feeling?
                </label>
                <div className="flex space-x-3">
                  {sentimentOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSentiment(option.value)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                          selectedSentiment === option.value
                            ? `${option.bg} border-current ${option.color}`
                            : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        <IconComponent size={18} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Display */}
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Calendar size={16} />
                <span>Today - {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setSelectedSentiment('neutral');
                    setIsExpanded(false);
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>Save Entry</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default JournalEditor;