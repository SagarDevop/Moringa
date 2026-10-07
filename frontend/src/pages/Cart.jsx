import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import { optimizeImageUrl } from '../utils/image';
import { APP_CONFIG } from '../data/sampleData';

export default function Cart() {
  const navigate = useNavigate();
  const { items, increment, decrement, removeItem, totalPrice, totalItems, donation, setDonation } = useCart();

  // Dynamic MRP and Savings Calculator
  const totalMRP = items.reduce((sum, item) => {
    const discountPercent = item.originalPrice 
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : ((item.price % 3 === 0) ? 15 : (item.price % 2 === 0) ? 10 : 20);
    const origPrice = item.originalPrice 
      ? item.originalPrice 
      : Math.round(item.price / (1 - (discountPercent / 100)));
    return sum + (origPrice * item.quantity);
  }, 0);

  const totalDiscount = Math.max(0, totalMRP - totalPrice);
  const deliveryCharge = APP_CONFIG.deliveryFee;
  const handlingCharge = APP_CONFIG.handlingFee;
  const finalTotal = totalPrice + deliveryCharge + handlingCharge + donation;
  const minOrderRequired = 150;
  const isMinOrderMet = totalPrice >= minOrderRequired;

  if (items.length === 0) {
    return (
      <div className="app-container" style={{ background: '#f1f5f9', minHeight: '100vh', paddingBottom: 80 }}>
        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 'var(--z-header)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', background: '#ffffff',
          borderBottom: '1px solid #EAE6DC', boxShadow: '0 2px 10px rgba(28, 59, 43, 0.05)'
        }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{
              border: 'none', background: '#F8F6F0', width: 36, height: 36, borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1C3B2B', fontSize: 20 }}>arrow_back</span>
          </button>
          <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1C3B2B', margin: 0, fontFamily: "'Outfit', sans-serif" }}>My Cart</h1>
        </header>

        {/* Empty State Card */}
        <div style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: '#f8fafc', border: '2px dashed #cbd5e1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#94a3b8' }}>
                remove_shopping_cart
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Your Cart is Empty!
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 24px', lineHeight: 1.5, maxWidth: 300 }}>
              Looks like you haven't added anything to your cart yet. Explore our fresh organic products!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                maxWidth: 240,
                padding: '14px 24px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 750,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(45, 138, 78, 0.3)',
                transition: 'transform 0.15s ease'
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ background: '#f1f5f9', minHeight: '100vh', paddingBottom: 160 }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', background: '#ffffff',
        borderBottom: '1px solid #EAE6DC', boxShadow: '0 2px 10px rgba(28, 59, 43, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{
              border: 'none',
              background: '#F8F6F0',
              width: 36,
              height: 36,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1C3B2B'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          </button>
          
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: '#1C3B2B', margin: 0, lineHeight: 1.2, fontFamily: "'Outfit', sans-serif" }}>
              My Cart
            </h1>
            <span style={{ fontSize: 11.5, color: '#2E7D32', fontWeight: 600 }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#EAF2E8', border: '1px solid #D2E2CF',
          padding: '6px 12px', borderRadius: '20px',
          color: '#1C3B2B', fontSize: 11.5, fontWeight: 700
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#2E7D32' }}>verified_user</span>
          <span>100% Safe</span>
        </div>
      </header>

      {/* Main Content (Flipkart 2-Column Responsive Grid) */}
      <main style={{ padding: '12px 12px 24px', width: '100%', maxWidth: 480, margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Cart Items & Extra Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Delivery Location Banner */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>
                  location_on
                </span>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block' }}>
                    Deliver to: Gujarat (State Area)
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Express Delivery in 30-40 Mins ⚡
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Items Card Container */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              {/* Card Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fafafa'
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Grocery Items ({totalItems})
                </span>
                {totalDiscount > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
                    Saving ₹{totalDiscount}
                  </span>
                )}
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item, index) => {
                  const discountPercent = item.originalPrice 
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : ((item.price % 3 === 0) ? 15 : (item.price % 2 === 0) ? 10 : 20);
                  const originalItemPrice = item.originalPrice 
                    ? item.originalPrice 
                    : Math.round(item.price / (1 - (discountPercent / 100)));

                  return (
                    <div 
                      key={item.id}
                      style={{
                        padding: '16px',
                        borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      {/* Top Row: Image & Details */}
                      <div style={{ display: 'flex', gap: 14 }}>
                        {/* Image Container */}
                        <div 
                          onClick={() => navigate(`/product/${item.productId || item.id.split('_')[0]}`)}
                          style={{
                            width: 76,
                            height: 76,
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            flexShrink: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4
                          }}
                        >
                          <img 
                            src={optimizeImageUrl(item.image, 180) || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} 
                            alt={item.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Product Info */}
                        <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h3 
                              onClick={() => navigate(`/product/${item.productId || item.id.split('_')[0]}`)}
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#0f172a',
                                margin: '0 0 4px',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>
                                Unit: {item.unit} {item.selectedSize && `• Size: ${item.selectedSize}`}
                              </span>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 800,
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                padding: '1px 5px',
                                borderRadius: '4px'
                              }}>
                                Botanís Wellness
                              </span>
                            </div>
                          </div>

                          {/* Pricing Row */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                              ₹{item.price * item.quantity}
                            </span>
                            {originalItemPrice > item.price && (
                              <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                                ₹{originalItemPrice * item.quantity}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#16a34a' }}>
                                {discountPercent}% Off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Row: Flipkart-style Stepper & Remove */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        borderTop: '1px dashed #f1f5f9'
                      }}>
                        {/* Quantity Stepper */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#ffffff'
                        }}>
                          <button
                            onClick={() => decrement(item.id)}
                            style={{
                              width: 32,
                              height: 30,
                              background: '#f8fafc',
                              border: 'none',
                              borderRight: '1px solid #cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#334155',
                              fontWeight: 'bold'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                          </button>

                          <span style={{
                            padding: '0 12px',
                            fontSize: 13,
                            fontWeight: 800,
                            color: '#0f172a',
                            minWidth: 24,
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increment(item.id)}
                            style={{
                              width: 32,
                              height: 30,
                              background: '#f8fafc',
                              border: 'none',
                              borderLeft: '1px solid #cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#334155',
                              fontWeight: 'bold'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                          </button>
                        </div>

                        {/* Remove Action Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e11d48',
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donation Selector Card (Gujarat Needy People) */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #fde68a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="material-symbols-outlined filled" style={{ color: '#d97706', fontSize: 20 }}>
                  volunteer_activism
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: '#92400e' }}>
                  Donate for Poor Families in Gujarat ❤️
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: '#78350f', margin: '0 0 12px', lineHeight: 1.4 }}>
                100% of your contribution directly feeds needy households in Gujarat.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[5, 10, 20].map((amt) => {
                  const isSelected = donation === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => setDonation(isSelected ? 0 : amt)}
                      style={{
                        flex: 1,
                        padding: '9px 0',
                        borderRadius: '8px',
                        background: isSelected ? 'var(--primary)' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--primary)',
                        border: isSelected ? '1px solid var(--primary)' : '1.5px solid #d97706',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      +₹{amt}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Flipkart Price Details Summary Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              position: 'sticky',
              top: 70
            }}>
              {/* Card Title */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #f1f5f9',
                fontSize: 13,
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Price Details
              </div>

              {/* Price Breakdown Rows */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#334155' }}>
                  <span>Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{totalMRP}</span>
                </div>

                {totalDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#16a34a', fontWeight: 600 }}>
                    <span>Discount</span>
                    <span>-₹{totalDiscount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#334155' }}>
                  <span>Handling Fee</span>
                  <span>₹{handlingCharge}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#334155' }}>
                  <div>
                    <span>Delivery Charges</span>
                    <span style={{ fontSize: 10.5, color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
                      Flat ₹25 (Kitne ke bhi order pe!)
                    </span>
                  </div>
                  <span>₹{deliveryCharge}</span>
                </div>

                {donation > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--primary)', fontWeight: 700 }}>
                    <span>Donation (Gujarat Needy) ❤️</span>
                    <span>₹{donation}</span>
                  </div>
                )}

                {/* Total Row */}
                <div style={{
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: 12,
                  marginTop: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>₹{finalTotal}</span>
                </div>

                {/* Savings Banner */}
                {totalDiscount > 0 && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    textAlign: 'center',
                    marginTop: 4
                  }}>
                    🎉 You will save ₹{totalDiscount} on this order
                  </div>
                )}
              </div>

              {/* Minimum Order Warning Notice */}
              {!isMinOrderMet && (
                <div style={{
                  background: '#fef2f2',
                  borderTop: '1px solid #fecaca',
                  padding: '10px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#dc2626',
                  textAlign: 'center'
                }}>
                  ⚠️ Minimum order value is ₹150. Add ₹{minOrderRequired - totalPrice} more to checkout!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Desktop & Mobile Sticky Bottom Checkout Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        boxSizing: 'border-box',
        padding: '10px 16px',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        zIndex: 'var(--z-cart-bar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, fontWeight: 850, color: '#0f172a', lineHeight: 1.1 }}>
            ₹{finalTotal}
          </span>
          {totalDiscount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
              Saved ₹{totalDiscount}
            </span>
          )}
        </div>

        <button
          onClick={() => {
            if (isMinOrderMet) {
              navigate('/checkout');
            }
          }}
          disabled={!isMinOrderMet}
          style={{
            flexGrow: 1,
            maxWidth: 320,
            padding: '13px 20px',
            background: isMinOrderMet ? 'var(--primary)' : '#cbd5e1',
            color: isMinOrderMet ? '#ffffff' : '#64748b',
            border: 'none',
            borderRadius: '10px',
            fontSize: 15,
            fontWeight: 800,
            cursor: isMinOrderMet ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: isMinOrderMet ? '0 4px 14px rgba(45, 138, 78, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          <span>{isMinOrderMet ? 'PLACE ORDER ON WHATSAPP' : `MIN ORDER ₹${minOrderRequired}`}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
