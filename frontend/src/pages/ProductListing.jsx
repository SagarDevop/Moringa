import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import TopAppBar from '../components/TopAppBar';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export default function ProductListing() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { getProductsByCategory, getCategory } = useProducts();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const category = getCategory(categoryId);
  const products = getProductsByCategory(categoryId);

  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (filter === 'low-high') list.sort((a, b) => a.price - b.price);
    else if (filter === 'high-low') list.sort((a, b) => b.price - a.price);
    else if (filter === 'popular') list = list.filter(p => p.featured).concat(list.filter(p => !p.featured));
    return list;
  }, [products, filter]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [categoryId]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'low-high', label: 'Price Low-High' },
    { id: 'high-low', label: 'Price High-Low' },
  ];

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      <TopAppBar
        title={category?.name || 'Products'}
        showBack
        showSearch
      />

      <main style={{ padding: '0 var(--container-padding)' }}>
        {/* Filter Pills */}
        <section className="no-scrollbar" style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-md)',
        }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: 'var(--space-xs) var(--space-md)',
                borderRadius: 'var(--radius-full)',
                background: filter === f.id ? 'var(--primary-container)' : 'var(--surface-container-high)',
                color: filter === f.id ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* Product Grid */}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : sortedProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-lg)',
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 64, color: 'var(--outline-variant)', marginBottom: 'var(--space-md)', display: 'block',
            }}>
              inventory_2
            </span>
            <p className="text-title-md" style={{ color: 'var(--on-surface-variant)' }}>
              No products found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--grid-gutter)',
            marginTop: 'var(--space-sm)',
          }}>
            {sortedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <CartBar />
      <BottomNav />
    </div>
  );
}
