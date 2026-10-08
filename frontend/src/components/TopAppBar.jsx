import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function TopAppBar({
  title = 'Botanís',
  showBack = false,
  showSearch = false,
  rightAction = null,
  transparent = false,
  onSearchClick,
}) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      width: '100%',
      background: '#F8F6F0',
      borderBottom: '1px solid #EAE6DC',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #EAE6DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C3B2B'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_back
            </span>
          </button>
        )}
        {title === 'Botanís' ? (
          <Logo type="full" size={24} />
        ) : (
          <h1 style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#1C3B2B',
            margin: 0,
            fontFamily: "'Playfair Display', Georgia, serif"
          }}>
            {title}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showSearch && (
          <button
            onClick={onSearchClick || (() => navigate('/search'))}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #EAE6DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1C3B2B'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              search
            </span>
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
}
