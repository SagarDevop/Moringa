import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo({ type = 'full', size = 36, style = {} }) {
  const navigate = useNavigate();
  const handleLogoClick = (e) => {
    e.stopPropagation();
    navigate('/');
  };

  if (type === 'mark') {
    return (
      <div 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', userSelect: 'none', ...style }}
        title="Botanís"
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="#1C3B2B" />
          <circle cx="50" cy="50" r="42" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Leaf emblem */}
          <path d="M50 20 C65 20, 75 35, 75 50 C75 65, 60 78, 50 82 C40 78, 25 65, 25 50 C25 35, 35 20, 50 20 Z" fill="#2E7D32" opacity="0.9" />
          <path d="M50 20 C50 35, 50 65, 50 82" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 40 Q62 32 68 36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 52 Q38 44 32 48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 64 Q60 58 64 60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Full Botanis Logo with Tagline
  return (
    <div 
      onClick={handleLogoClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        cursor: 'pointer',
        userSelect: 'none',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', position: 'relative' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', 'Outfit', Georgia, serif",
          fontSize: '26px',
          fontWeight: 800,
          color: '#1C3B2B',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'baseline'
        }}>
          Botan
          <span style={{ position: 'relative', display: 'inline-block' }}>
            i
            {/* Leaf accent replacing dot of 'i' */}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="#2E7D32" 
              style={{
                position: 'absolute',
                top: '-7px',
                left: '-2px',
                transform: 'rotate(15deg)'
              }}
            >
              <path d="M17,8C8,10 59,1611 12,23C13,23 20.5,15.5 20,9.5C19.5,3.5 17,8 17,8Z" fill="#2E7D32" />
            </svg>
          </span>
          s
        </h1>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#1C3B2B',
          marginLeft: '2px',
          verticalAlign: 'super'
        }}>®</span>
      </div>

      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '9.5px',
        fontWeight: 600,
        color: '#2E7D32',
        fontStyle: 'italic',
        marginTop: '3px',
        letterSpacing: '-0.01em',
        lineHeight: 1.1
      }}>
        Your Trusted Path to Healthy Living
      </span>
    </div>
  );
}
