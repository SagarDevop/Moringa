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
      bottom: visible ? 68 : -90,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
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
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(22, 75, 43, 0.35)',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Section: Icon + Item Count + Savings on 1 Single Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined filled" style={{ fontSize: 18, color: '#C29B38' }}>
              shopping_cart
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 12.5, fontWeight: 800 }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
            {totalSavings > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#D2E2CF', whiteSpace: 'nowrap' }}>
                | Save ₹{totalSavings}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Total Price + View Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            ₹{totalPrice}
          </span>
          <div style={{
            background: '#FFFFFF',
            color: '#164b2b',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: 11.5,
            fontWeight: 850,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            whiteSpace: 'nowrap'
          }}>
            <span>View Cart</span>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
}
