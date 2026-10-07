import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import TopAppBar from '../components/TopAppBar';
import { optimizeImageUrl } from '../utils/image';

export default function CategoryList() {
  const navigate = useNavigate();
  const { categories, getCategoryProductCount } = useProducts();

  return (
    <div className="app-container" style={{ paddingBottom: 140 }}>
      <TopAppBar title="Categories" showSearch />

      <main style={{ padding: 'var(--space-md) var(--container-padding)' }}>
        {categories.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh'
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 64, color: 'var(--outline-variant)', marginBottom: 'var(--space-md)', display: 'block',
            }}>
              category
            </span>
            <p className="text-title-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-sm)' }}>
              No categories found
            </p>
            <p className="text-body-md" style={{ color: 'var(--outline)', maxWidth: 260, margin: '0 auto', fontSize: 13, lineHeight: 1.4 }}>
              Shelves are currently empty. Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}>
            {categories.map((category) => {
              const count = getCategoryProductCount(category.id);
              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/category/${category.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-md) 0',
                    borderBottom: '1px solid var(--outline-variant)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '1px solid var(--outline-variant)',
                      background: 'var(--surface-container-low)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <img
                        src={optimizeImageUrl(category.image, 120) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                        alt={category.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-title-md" style={{
                        color: 'var(--on-surface)',
                        fontWeight: 600,
                        margin: 0,
                        fontSize: 15,
                      }}>
                        {category.name}
                      </h3>
                      <p className="text-body-md" style={{
                        color: 'var(--outline)',
                        fontSize: 12,
                        marginTop: 2,
                      }}>
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{
                    color: 'var(--outline)',
                    fontSize: 20,
                  }}>
                    chevron_right
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CartBar />
      <BottomNav />
    </div>
  );
}
