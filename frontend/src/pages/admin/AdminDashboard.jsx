import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, categories } = useProducts();

  const recentProducts = [...products].slice(0, 5);

  const stats = [
    { label: 'Total Products', value: products.length, icon: 'inventory_2', color: 'var(--primary)' },
    { label: 'Categories', value: categories.length, icon: 'category', color: 'var(--secondary)' },
    { label: 'In Stock', value: products.filter(p => p.available).length, icon: 'check_circle', color: '#2d8a4e' },
    { label: 'Out of Stock', value: products.filter(p => !p.available).length, icon: 'cancel', color: 'var(--error)' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('bandamart_admin');
    navigate('/admin');
  };

  return (
    <div className="app-container admin-container" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-md) var(--container-padding)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-lg)',
            background: 'var(--primary-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined filled" style={{ fontSize: 20, color: 'var(--on-primary-container)' }}>
              admin_panel_settings
            </span>
          </div>
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>
            Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-container-low)',
              color: 'var(--on-surface-variant)',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>storefront</span>
            Store
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-lg)',
              background: 'var(--error-container)',
              color: 'var(--on-error-container)',
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: 'var(--space-lg) var(--container-padding)' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-md)',
              animation: `fadeInUp 0.3s ease ${i * 0.05}s forwards`,
              opacity: 0,
            }}>
              <span className="material-symbols-outlined filled" style={{
                fontSize: 28, color: stat.color, marginBottom: 'var(--space-sm)', display: 'block',
              }}>
                {stat.icon}
              </span>
              <p className="text-headline-lg" style={{ color: 'var(--on-surface)', margin: '0 0 2px' }}>
                {stat.value}
              </p>
              <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-md)' }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--space-md)', marginBottom: 'var(--space-xl)',
        }}>
          <button
            onClick={() => navigate('/admin/products')}
            style={{
              padding: 'var(--space-lg)',
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'var(--space-sm)',
              fontWeight: 600, fontSize: 14,
              transition: 'transform 0.2s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>inventory_2</span>
            Manage Products
          </button>
          <button
            onClick={() => navigate('/admin/categories')}
            style={{
              padding: 'var(--space-lg)',
              background: 'var(--secondary-container)',
              color: 'var(--on-secondary-container)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'var(--space-sm)',
              fontWeight: 600, fontSize: 14,
              transition: 'transform 0.2s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>category</span>
            Manage Categories
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            style={{
              padding: 'var(--space-lg)',
              background: 'var(--tertiary-container)',
              color: 'var(--on-tertiary-container)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'var(--space-sm)',
              fontWeight: 600, fontSize: 14,
              transition: 'transform 0.2s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>settings</span>
            Manage Settings
          </button>
        </div>

        {/* Recent Products */}
        <h3 className="text-title-md" style={{ color: 'var(--on-surface)', margin: '0 0 var(--space-md)' }}>
          Recently Added
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {recentProducts.map(product => (
            <div key={product.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(194,201,187,0.2)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                overflow: 'hidden', background: 'var(--surface-container)',
                flexShrink: 0,
              }}>
                <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p className="truncate" style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                  {product.name}
                </p>
                <p className="text-label-sm" style={{ color: 'var(--outline)', margin: 0 }}>
                  ₹{product.price}/{product.unit}
                </p>
              </div>
              <span style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: product.available ? 'rgba(45,138,78,0.1)' : 'var(--error-container)',
                color: product.available ? '#2d8a4e' : 'var(--on-error-container)',
                fontSize: 11, fontWeight: 600,
              }}>
                {product.available ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
