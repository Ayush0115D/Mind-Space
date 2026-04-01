import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Heart, Send, ChevronDown, ChevronUp, Trash2, Loader2, X, MessageCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/community`;

const TOPICS = [
  { id: 'all',           label: 'All',          emoji: '🌍', color: '#a78bfa' },
  { id: 'general',       label: 'General',      emoji: '💬', color: '#94a3b8' },
  { id: 'stress',        label: 'Stress',       emoji: '😤', color: '#fb923c' },
  { id: 'depression',    label: 'Depression',   emoji: '💙', color: '#60a5fa' },
  { id: 'motivation',    label: 'Motivation',   emoji: '💪', color: '#fbbf24' },
  { id: 'sleep',         label: 'Sleep',        emoji: '😴', color: '#818cf8' },
  { id: 'relationships', label: 'Relations',    emoji: '❤️', color: '#f87171' },
  { id: 'good-vibes',    label: 'Good Vibes',   emoji: '✨', color: '#34d399' },
  { id: 'wins',          label: 'Wins',         emoji: '🏆', color: '#f59e0b' },
];

const REACTIONS = [
  { key: 'heart',  emoji: '❤️',  label: 'Love' },
  { key: 'hug',    emoji: '🤗',  label: 'Hug'  },
  { key: 'strong', emoji: '💪',  label: 'Strong' },
];

const getToken = () => localStorage.getItem('token');

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Post Card ────────────────────────────────────────────────────────────────
const PostCard = ({ post, currentUserId, onReact, onReply, onDelete }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const topic = TOPICS.find(t => t.id === post.topic) || TOPICS[1];
  const isOwn = post.userId?.toString() === currentUserId;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);
    await onReply(post._id, replyText);
    setReplyText('');
    setReplying(false);
    setShowReplies(true);
    setShowReplyInput(false);
  };

  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '20px',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Avatar */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${topic.color}44, ${topic.color}22)`,
            border: `1px solid ${topic.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0
          }}>
            {post.anonName?.split(' ')[0]?.[0] || '?'}
          </div>
          <div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>{post.anonName}</p>
            <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Topic badge */}
          <span style={{
            background: `${topic.color}18`, border: `1px solid ${topic.color}33`,
            color: topic.color, padding: '3px 10px', borderRadius: '20px',
            fontSize: '11px', fontWeight: 600
          }}>{topic.emoji} {topic.label}</span>
          {/* Delete (own posts only) */}
          {isOwn && (
            <button onClick={() => onDelete(post._id)} style={{
              background: 'none', border: 'none', color: '#475569',
              cursor: 'pointer', padding: '4px', borderRadius: '6px',
              display: 'flex', alignItems: 'center'
            }}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }}>
        {post.content}
      </p>

      {/* Reactions + Reply */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {REACTIONS.map(r => (
          <button key={r.key} onClick={() => onReact(post._id, r.key)} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: post.myReaction === r.key ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${post.myReaction === r.key ? '#a78bfa55' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '20px', padding: '5px 12px',
            color: post.myReaction === r.key ? '#a78bfa' : '#64748b',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            transition: 'all 0.15s'
          }}>
            <span>{r.emoji}</span>
            <span>{post.reactions?.[r.key] || 0}</span>
          </button>
        ))}

        {/* Reply button */}
        <button onClick={() => setShowReplyInput(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '5px 12px',
          color: '#64748b', cursor: 'pointer', fontSize: '13px',
          marginLeft: 'auto', transition: 'all 0.15s'
        }}>
          <MessageCircle size={13} />
          <span>Reply</span>
        </button>

        {/* Show replies toggle */}
        {post.replies?.length > 0 && (
          <button onClick={() => setShowReplies(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', color: '#64748b',
            cursor: 'pointer', fontSize: '12px'
          }}>
            {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()}
            placeholder="Write a supportive reply..."
            maxLength={500}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
              padding: '9px 14px', color: '#e2e8f0', fontSize: '13px',
              outline: 'none'
            }}
          />
          <button onClick={handleReply} disabled={replying || !replyText.trim()} style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: 'none', borderRadius: '10px', padding: '9px 14px',
            color: 'white', cursor: replying ? 'not-allowed' : 'pointer',
            opacity: replying || !replyText.trim() ? 0.5 : 1,
            display: 'flex', alignItems: 'center'
          }}>
            {replying ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
          </button>
        </div>
      )}

      {/* Replies */}
      {showReplies && post.replies?.length > 0 && (
        <div style={{ marginTop: '14px', borderLeft: '2px solid rgba(167,139,250,0.2)', paddingLeft: '14px' }}>
          {post.replies.map((reply, i) => (
            <div key={i} style={{ marginBottom: i < post.replies.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 600 }}>{reply.anonName}</span>
                <span style={{ color: '#334155', fontSize: '11px' }}>{timeAgo(reply.createdAt)}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── New Post Modal ───────────────────────────────────────────────────────────
const NewPostModal = ({ onClose, onPost }) => {
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    const result = await onPost(content, topic);
    if (result?.error) setError(result.error);
    else onClose();
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', background: '#0f172a',
        border: '1px solid rgba(167,139,250,0.25)', borderRadius: '20px',
        padding: '28px', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '18px', margin: '0 0 6px' }}>Share with the Community</h3>
        <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 20px' }}>You're anonymous — be open, be kind 💙</p>

        {/* Topic selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {TOPICS.filter(t => t.id !== 'all').map(t => (
            <button key={t.id} onClick={() => setTopic(t.id)} style={{
              background: topic === t.id ? `${t.color}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${topic === t.id ? t.color + '55' : 'rgba(255,255,255,0.08)'}`,
              color: topic === t.id ? t.color : '#64748b',
              padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, transition: 'all 0.15s'
            }}>{t.emoji} {t.label}</button>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind? Share your thoughts, feelings, or anything you'd like support with..."
          maxLength={1000}
          rows={5}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
            padding: '14px', color: '#e2e8f0', fontSize: '14px',
            outline: 'none', resize: 'vertical', lineHeight: 1.6,
            boxSizing: 'border-box'
          }}
        />
        <p style={{ color: '#334155', fontSize: '11px', textAlign: 'right', margin: '4px 0 0' }}>{content.length}/1000</p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', margin: '10px 0 0', background: '#ef444422', padding: '10px 14px', borderRadius: '8px' }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748b', cursor: 'pointer', fontSize: '14px'
          }}>Cancel</button>
          <button onClick={handlePost} disabled={loading || !content.trim()} style={{
            flex: 2, padding: '12px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            border: 'none', color: 'white', fontWeight: 700,
            cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !content.trim() ? 0.6 : 1,
            fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Posting...' : 'Post Anonymously 🌸'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Community Component ─────────────────────────────────────────────────
const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?._id || ''; } catch { return ''; }
  })();

  const fetchPosts = useCallback(async (topic, pg = 1, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?topic=${topic}&page=${pg}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => append ? [...prev, ...data.data] : data.data);
        setHasMore(pg < data.pages);
        setPage(pg);
      }
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(activeTopic, 1); }, [activeTopic]);

  const handlePost = async (content, topic) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content, topic })
      });
      const data = await res.json();
      if (!data.success) return { error: data.message };
      setPosts(prev => [data.data, ...prev]);
      return {};
    } catch { return { error: 'Failed to post. Try again.' }; }
  };

  const handleReact = async (postId, reaction) => {
    try {
      const res = await fetch(`${API_URL}/${postId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ reaction })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p._id === postId
          ? { ...p, reactions: data.reactions, myReaction: data.myReaction }
          : p
        ));
      }
    } catch {}
  };

  const handleReply = async (postId, content) => {
    try {
      const res = await fetch(`${API_URL}/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p._id === postId
          ? { ...p, replies: [...(p.replies || []), data.data] }
          : p
        ));
      }
    } catch {}
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setPosts(prev => prev.filter(p => p._id !== postId));
    } catch {}
  };

  return (
    <section style={{ minHeight: '100vh', padding: '40px 0' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(219,39,119,0.3))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(167,139,250,0.2)'
        }}>
          <Users size={32} color="#a78bfa" />
        </div>
        <h2 style={{
          fontSize: '42px', fontWeight: 900, margin: '0 0 8px',
          background: 'linear-gradient(135deg, #a78bfa, #db2777, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>Community Space</h2>
        <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
          A safe, anonymous space to share, support, and connect 💙
        </p>
      </div>

      {/* Topic Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setActiveTopic(t.id)} style={{
            background: activeTopic === t.id ? `${t.color}22` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${activeTopic === t.id ? t.color + '55' : 'rgba(255,255,255,0.08)'}`,
            color: activeTopic === t.id ? t.color : '#64748b',
            padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, transition: 'all 0.15s'
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>

      {/* New Post Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={() => setShowNewPost(true)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          border: 'none', borderRadius: '12px', padding: '11px 20px',
          color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.3)'
        }}>
          <Plus size={16} /> Share Something
        </button>
      </div>

      {/* Posts */}
      {loading && posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 size={32} color="#a78bfa" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: '#475569' }}>Loading community posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</p>
          <p style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600 }}>Be the first to share!</p>
          <p style={{ color: '#475569', fontSize: '14px' }}>Start a conversation in this topic.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onReact={handleReact}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => fetchPosts(activeTopic, page + 1, true)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', padding: '10px 28px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '14px'
          }}>Load more</button>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} onPost={handlePost} />}
    </section>
  );
};

export default Community;