import React, { useState } from 'react';
import { Send, Image, Smile } from 'lucide-react';

const PostForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({
        content: content.trim(),
        isAnonymous,
        timestamp: new Date().toISOString(),
        id: Date.now() // Simple ID generation
      });
      setContent('');
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, experiences, or ask for support..."
            className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 min-h-[120px]"
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {content.length}/500
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-slate-900 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-sm text-slate-300">Post anonymously</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-purple-400 transition-colors duration-200 rounded-lg hover:bg-slate-700/50"
              title="Add image"
            >
              <Image size={18} />
            </button>
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-yellow-400 transition-colors duration-200 rounded-lg hover:bg-slate-700/50"
              title="Add emoji"
            >
              <Smile size={18} />
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;