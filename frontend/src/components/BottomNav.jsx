import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'offers', label: 'Offers', icon: 'local_offer', path: '/offers' },
  { id: 'cart', label: 'Cart', icon: 'shopping_bag', path: '/cart', isCart: true },
  { id: 'about', label: 'About Us', icon: 'info', path: '/about' },
  { id: 'contact', label: 'Contact', icon: 'chat_bubble', path: '/contact' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { whatsappNumber } = useProducts();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 0) return;

      if (currentScrollY < 50) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = Math.abs(currentScrollY - lastScrollY.current);
      if (diff > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <nav className="botanis-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(120%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 90,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 10px 12px',
      background: 'rgba(248, 246, 240, 0.96)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 -4px 20px rgba(28, 59, 43, 0.08)',
      borderRadius: '24px 24px 0 0',
      borderTop: '1px solid #EAE6DC',
      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'contact') {
                window.open(`https://wa.me/${whatsappNumber}`, '_blank');
              } else {
                navigate(tab.path);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 6px',
              borderRadius: '12px',
              background: active ? '#EAF2E8' : 'transparent',
              color: active ? '#1C3B2B' : '#768379',
              position: 'relative',
              flex: 1,
              minWidth: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: tab.isCart ? 24 : 22,
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  color: active ? '#1C3B2B' : '#64748b'
                }}
              >
                {tab.icon}
              </span>
              {tab.isCart && totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  minWidth: 16,
                  height: 16,
                  padding: '0 3px',
                  borderRadius: '9999px',
                  background: '#2E7D32',
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #F8F6F0'
                }}>
                  {totalItems}
                </span>
              )}
            </div>
            <span style={{ 
              fontSize: 10, 
              marginTop: 3,
              fontWeight: active ? 750 : 500,
              letterSpacing: '-0.01em',
              fontFamily: "'Inter', sans-serif"
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
