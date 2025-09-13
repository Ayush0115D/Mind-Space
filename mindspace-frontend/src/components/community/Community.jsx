import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Users } from 'lucide-react';
import PostForm from './PostForm';

const Community = () => {
  const [posts, setPosts] = useState([]); // start with empty posts

  const handleNewPost = (newPost) => {
    const post = {
      ...newPost,
      id: Date.now(), // unique ID for each post
      author: newPost.isAnonymous ? 'Anonymous' : 'You',
      likes: 0,
      comments: 0,
      isLiked: false,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-purple-600/20 rounded-xl">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Community Support</h2>
            <p className="text-slate-300 text-sm">Share experiences, find support, and connect with others</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">847</div>
            <div className="text-sm text-slate-400">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">1.2k</div>
            <div className="text-sm text-slate-400">Posts Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">95%</div>
            <div className="text-sm text-slate-400">Positive Feedback</div>
          </div>
        </div>
      </div>

      {/* Post Form */}
      <PostForm onSubmit={handleNewPost} />

      {/* Community Guidelines */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-sm font-medium text-white mb-2">Community Guidelines</h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• Be respectful and supportive of all members</li>
          <li>• Share experiences, not professional medical advice</li>
          <li>• Use content warnings for sensitive topics</li>
          <li>• Report inappropriate content to moderators</li>
        </ul>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Recent Posts</span>
        </h3>

        {posts.length === 0 ? (
          <p className="text-slate-400 text-sm">No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {post.isAnonymous ? '?' : post.author.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{post.author}</span>
                      {post.isAnonymous && (
                        <span className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300">
                          Anonymous
                        </span>
                      )}
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{post.timestamp}</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors duration-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <p className="text-slate-200 mb-4 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-sm text-slate-400 hover:text-green-400 transition-colors duration-200">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {posts.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors duration-200">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
