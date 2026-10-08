import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BotanisProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, increment, decrement } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const qty = getItemQuantity(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    increment(product.id);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    decrement(product.id);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #EAE6DC',
        boxShadow: '0 2px 12px rgba(28, 59, 43, 0.04)',
        padding: '12px 10px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#1C3B2B';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(28, 59, 43, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#EAE6DC';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(28, 59, 43, 0.04)';
      }}
    >
      {/* Product Image Container */}
      <div style={{
        width: '100%',
        aspectRatio: '1.0',
        borderRadius: '14px',
        background: '#F8F6F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        marginBottom: '10px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={product.image}
          alt={product.name}
          width="160"
          height="160"
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Category tag badge */}
        {product.unit && (
          <span style={{
            position: 'absolute',
            bottom: 6,
            left: 6,
            background: 'rgba(28, 59, 43, 0.9)',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 750,
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {product.unit}
          </span>
        )}
      </div>

      {/* Product Name */}
      <h4 style={{
        fontSize: '12.5px',
        fontWeight: 750,
        color: '#1C3B2B',
        margin: '0 0 3px 0',
        lineHeight: 1.25,
        height: '32px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        fontFamily: "'Inter', sans-serif"
      }}>
        {product.name}
      </h4>

      {/* Short Benefit Subtitle */}
      <p style={{
        fontSize: '10px',
        color: '#667085',
        fontWeight: 500,
        margin: '0 0 10px 0',
        height: '24px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.25
      }}>
        {product.subtitle || product.description || 'Pure Natural Wellness'}
      </p>

      {/* Price & Add Button Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: '2px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontSize: '14.5px',
            fontWeight: 800,
            color: '#1C3B2B',
            fontFamily: "'Inter', sans-serif"
          }}>
            ₹{product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span style={{
              fontSize: '9.5px',
              color: '#98A2B3',
              textDecoration: 'line-through',
              marginTop: '2px'
            }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Action */}
        {qty > 0 ? (
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1C3B2B',
              borderRadius: '20px',
              padding: '2px 8px',
              height: '30px',
              gap: '6px'
            }}
          >
            <button
              onClick={handleDecrement}
              style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              -
            </button>
            <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 800 }}>
              {qty}
            </span>
            <button
              onClick={handleIncrement}
              style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: justAdded ? '#2E7D32' : '#1C3B2B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(28, 59, 43, 0.25)',
              transition: 'transform 0.15s ease, background 0.2s ease',
              transform: justAdded ? 'scale(1.15)' : 'scale(1)'
            }}
            title="Add to Cart"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {justAdded ? 'check' : 'shopping_bag'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
