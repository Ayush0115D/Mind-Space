import React, { useState } from 'react';
import { Calendar, Clock, Smile, Frown, Meh, MoreHorizontal, Edit2, Trash2, Heart } from 'lucide-react';

const JournalEntry = ({ entry, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return { icon: Smile, color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'negative':
        return { icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20' };
      default:
        return { icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString) => {
    if (!entry.timestamp) return '';
    const date = new Date(entry.timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const truncateContent = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const sentimentData = getSentimentIcon(entry.sentiment);
  const SentimentIcon = sentimentData.icon;

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`p-2 rounded-lg ${sentimentData.bg}`}>
              <SentimentIcon className={`w-5 h-5 ${sentimentData.color}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formatDate(entry.date)}</span>
                </div>
                {entry.timestamp && (
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{formatTime(entry.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-700/50"
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                <button
                  onClick={() => {
                    onEdit && onEdit(entry);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Edit2 size={14} />
                  <span>Edit Entry</span>
                </button>
                <button
                  onClick={() => {
                    onDelete && onDelete(entry.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete Entry</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-200 leading-relaxed">
          <p>
            {isExpanded ? entry.content : truncateContent(entry.content)}
          </p>
          
          {entry.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span className="capitalize">{entry.sentiment} mood</span>
          </div>
          
          <button className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors duration-200">
            <Heart size={16} />
            <span className="text-sm">Favorite</span>
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default JournalEntry;