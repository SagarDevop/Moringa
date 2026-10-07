import React from 'react';

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid rgba(194, 201, 187, 0.2)',
    }}>
      <div className="skeleton skeleton-image" style={{ width: '100%' }} />
      <div style={{ padding: 'var(--space-md)' }}>
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton skeleton-text short" />
        <div className="skeleton" style={{ height: 32, borderRadius: 'var(--radius-xl)', marginTop: 12 }} />
      </div>
    </div>
  );
}

export function SkeletonCategory() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      flexShrink: 0,
    }}>
      <div className="skeleton skeleton-circle" style={{ width: 64, height: 64 }} />
      <div className="skeleton skeleton-text" style={{ width: 48 }} />
    </div>
  );
}

export function SkeletonCartItem() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      padding: 'var(--space-md)',
      background: 'var(--surface-container-lowest)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton skeleton-text short" />
        <div className="skeleton" style={{ height: 28, width: 100, borderRadius: 'var(--radius-full)', marginTop: 8 }} />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="skeleton" style={{
      width: '100%',
      height: 180,
      borderRadius: 'var(--radius-2xl)',
    }} />
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--grid-gutter)',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
