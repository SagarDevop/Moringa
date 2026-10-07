import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';

export default function Search() {
  const navigate = useNavigate();
  const { searchProducts } = useProducts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchProducts(query));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      {/* Search Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'var(--surface)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
      }}>
        <button onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>arrow_back</span>
        </button>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <div style={{
            position: 'absolute', left: 'var(--space-md)', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: 20 }}>search</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search vegetables, fruits..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-full)',
              fontSize: 16,
              color: 'var(--on-surface)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>close</span>
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: 'var(--space-md) var(--container-padding)' }}>
        {query.length < 2 ? (
          <div style={{
            textAlign: 'center', padding: 'var(--space-2xl)',
            color: 'var(--on-surface-variant)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--outline-variant)', display: 'block', marginBottom: 'var(--space-md)' }}>
              search
            </span>
            <p className="text-body-lg">Type to search for products</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 'var(--space-2xl)',
            color: 'var(--on-surface-variant)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--outline-variant)', display: 'block', marginBottom: 'var(--space-md)' }}>
              search_off
            </span>
            <p className="text-title-md">No products found</p>
            <p className="text-body-md" style={{ color: 'var(--outline)' }}>
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            <p className="text-label-sm" style={{
              color: 'var(--on-surface-variant)',
              marginBottom: 'var(--space-md)',
            }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--grid-gutter)',
            }}>
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      <CartBar />
      <BottomNav />
    </div>
  );
}
