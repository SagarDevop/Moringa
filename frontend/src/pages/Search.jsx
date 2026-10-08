import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import BotanisProductCard from '../components/BotanisProductCard';
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
    if (query.trim().length >= 1) {
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
        padding: '12px 16px',
        background: '#ffffff',
        display: 'flex', alignItems: 'center', gap: '12px',
        borderBottom: '1px solid #EAE6DC'
      }}>
        <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ color: '#1C3B2B', fontSize: 22 }}>arrow_back</span>
        </button>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <div style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#768379', fontSize: 20 }}>search</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Moringa, Ashwagandha..."
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              background: '#F8F6F0',
              borderRadius: '50px',
              fontSize: 14,
              color: '#1C3B2B',
              border: '1px solid #EAE6DC'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                border: 'none', background: 'transparent', cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#768379' }}>close</span>
            </button>
          )}
        </div>
      </header>

      <main style={{ padding: '16px 16px 30px' }}>
        {query.length < 1 ? (
          <div style={{
            textAlign: 'center', padding: '40px 16px',
            color: '#768379',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#C29B38', display: 'block', marginBottom: '12px' }}>
              search
            </span>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Type to search Botanís organic superfoods</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 16px',
            color: '#768379',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#768379', display: 'block', marginBottom: '12px' }}>
              search_off
            </span>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1C3B2B' }}>No products found</p>
            <p style={{ fontSize: 13, color: '#768379' }}>
              Try searching for Moringa, Powder, or Tablets
            </p>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#2E7D32',
              marginBottom: '12px',
            }}>
              {results.length} product{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="botanis-products-grid">
              {results.map(product => (
                <BotanisProductCard key={product.id} product={product} />
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
