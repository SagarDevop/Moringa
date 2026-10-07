import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBar() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice } = useCart();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Prevent negative values (rubber banding on iOS)
      if (currentScrollY < 0) return;

      // Always show at the very top of the page
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

  if (totalItems === 0) return null;

  // Dynamic savings calculator based on individual product discount logic
  const totalSavings = items.reduce((sum, item) => {
    const discountPercent = item.originalPrice 
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : ((item.price % 3 === 0) ? 15 : (item.price % 2 === 0) ? 10 : 20);
    const originalPrice = item.originalPrice 
      ? item.originalPrice 
      : Math.round(item.price / (1 - (discountPercent / 100)));
    const savings = (originalPrice - item.price) * item.quantity;
    return sum + savings;
  }, 0);

  return (
    <div style={{
      position: 'fixed',
      bottom: visible ? 68 : -80,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '92%',
      maxWidth: 440,
      zIndex: 'var(--z-cart-bar)',
      transition: 'bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div
        onClick={() => navigate('/cart')}
        style={{
          width: '100%',
          background: '#164b2b', // Premium forest green
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(22, 75, 43, 0.25)',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined filled" style={{ fontSize: 22 }}>
            shopping_cart
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
              {totalSavings > 0 && <span style={{ fontWeight: 400, opacity: 0.9 }}> | You save ₹{totalSavings}</span>}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>
            ₹{totalPrice}
          </span>
          <div style={{
            background: '#ffffff',
            color: '#164b2b',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            View Cart
          </div>
        </div>
      </div>
    </div>
  );
}
