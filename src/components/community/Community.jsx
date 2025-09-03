import React, { useState } from 'react';
import PostForm from './PostForm';
import CommunityPost from './CommunityPost';

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: 'Remember, progress isn\'t always linear. You\'re doing better than you think.',
      likes: 24,
      replies: 8,
      timeAgo: '2h ago',
      sentiment: 'supportive'
    }
  ]);

  const addPost = (newPost) => {
    setPosts([{ ...newPost, id: Date.now() }, ...posts]);
  };

  return (
    <div className="space-y-8">
      <PostForm onAddPost={addPost} />
      <div className="space-y-6">
        {posts.map((post) => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Community;