import React, { useState } from 'react';
import { TrendingUp, Smile, Target, BookOpen, Brain, Users } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',       icon: TrendingUp, accent: '#a78bfa', glow: 'rgba(167,139,250,0.18)', tag: 'Overview' },
    { id: 'mood',         label: 'Mood Tracker',    icon: Smile,      accent: '#f472b6', glow: 'rgba(244,114,182,0.18)', tag: 'Daily'    },
    { id: 'goals',        label: 'Goals & Habits',  icon: Target,     accent: '#38bdf8', glow: 'rgba(56,189,248,0.18)',  tag: 'Track'    },
    { id: 'resources',    label: 'Resources',       icon: BookOpen,   accent: '#34d399', glow: 'rgba(52,211,153,0.18)',  tag: 'Learn'    },
    { id: 'ai-recommend', label: 'Recommendations', icon: Brain,      accent: '#818cf8', glow: 'rgba(129,140,248,0.18)', tag: 'AI'       },
    { id: 'community',    label: 'Community',       icon: Users,      accent: '#fb7185', glow: 'rgba(251,113,133,0.18)', tag: 'Together' }, // ✨ NEW
  ];

  return (
    <div style={{ width: '272px', minWidth: '272px', flexShrink: 0 }}>
      <style>{`
        @keyframes msPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      <nav style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '14px 12px',
        position: 'sticky',
        top: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '4px 10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: '6px',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#a78bfa',
            boxShadow: '0 0 8px rgba(167,139,250,0.9)',
            display: 'inline-block',
            animation: 'msPulse 2.5s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: '10px', fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
          }}>Menu</span>
        </div>

        {/* Nav Items */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isHovered = hoveredItem === item.id;
          const lit = isActive || isHovered;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 12px',
                borderRadius: '10px',
                border: 'none',
                background: isActive
                  ? 'rgba(255,255,255,0.06)'
                  : isHovered
                    ? 'rgba(255,255,255,0.03)'
                    : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                textAlign: 'left',
                outline: 'none',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.07)' : 'none',
              }}
            >
              {/* Left accent bar */}
              <span style={{
                position: 'absolute',
                left: 0, top: '50%',
                transform: `translateY(-50%) scaleY(${lit ? 1 : 0})`,
                width: '3px', height: '52%',
                borderRadius: '0 3px 3px 0',
                background: item.accent,
                boxShadow: `2px 0 10px ${item.glow}`,
                transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              }} />

              {/* Icon box */}
              <span style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: lit ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${lit ? item.accent + '40' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: lit ? `0 0 14px ${item.glow}` : 'none',
                transition: 'all 0.18s ease',
                flexShrink: 0,
              }}>
                <Icon style={{
                  width: '16px', height: '16px',
                  color: lit ? item.accent : 'rgba(255,255,255,0.28)',
                  transition: 'color 0.18s ease',
                }} />
              </span>

              {/* Labels */}
              <span style={{
                display: 'flex', flexDirection: 'column', gap: '2px',
                flex: 1, minWidth: 0,
              }}>
                <span style={{
                  fontSize: '14px', fontWeight: 500,
                  color: lit ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.5)',
                  transition: 'color 0.18s ease',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{item.label}</span>
                <span style={{
                  fontSize: '11px',
                  color: lit ? item.accent : 'rgba(255,255,255,0.2)',
                  transition: 'color 0.18s ease',
                }}>{item.tag}</span>
              </span>

              {/* Active dot */}
              {isActive && (
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: item.accent,
                  boxShadow: `0 0 8px ${item.glow}`,
                  flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}

      </nav>
    </div>
  );
};

export default Sidebar;