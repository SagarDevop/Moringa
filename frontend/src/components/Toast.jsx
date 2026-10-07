import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="botanis-toast-container">
      <div className="botanis-toast">
        <span className="material-symbols-outlined filled" style={{ color: '#C29B38', fontSize: '20px' }}>
          check_circle
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
