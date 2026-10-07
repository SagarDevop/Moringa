import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const OFFERS_LIST = [
  {
    id: 'off_1',
    badge: 'WELCOME OFFER',
    title: '15% OFF First Order',
    description: 'Experience pure natural wellness! Enjoy 15% instant discount on your first Botanís purchase.',
    code: 'BOTANIS15',
    minOrder: 'Min. order ₹299',
    expiry: 'Valid for new customers',
    icon: 'card_giftcard',
    bg: 'linear-gradient(135deg, #1C3B2B 0%, #0F2319 100%)',
    textColor: '#FFFFFF',
    badgeBg: '#C29B38',
    badgeColor: '#1C3B2B',
    iconBg: 'rgba(255, 255, 255, 0.12)',
    iconColor: '#C29B38',
    btnBg: '#C29B38',
    btnColor: '#1C3B2B'
  },
  {
    id: 'off_2',
    badge: 'SUPERFOOD SPECIAL',
    title: '20% OFF Moringa Range',
    description: 'Special savings on Moringa Leaf Powder & Supplement Tablets. Boost immunity naturally.',
    code: 'MORINGA20',
    minOrder: 'Min. order ₹499',
    expiry: 'Valid on Moringa products',
    icon: 'eco',
    bg: 'linear-gradient(135deg, #2E7D32 0%, #1C3B2B 100%)',
    textColor: '#FFFFFF',
    badgeBg: '#EAF2E8',
    badgeColor: '#1C3B2B',
    iconBg: 'rgba(255, 255, 255, 0.15)',
    iconColor: '#EAF2E8',
    btnBg: '#FFFFFF',
    btnColor: '#1C3B2B'
  },
  {
    id: 'off_3',
    badge: 'DAILY WELLNESS',
    title: 'Flat ₹50 OFF Instantly',
    description: 'Get flat ₹50 discount on all wellness supplement orders. Pure organic healthcare for your family.',
    code: 'HEALTHY50',
    minOrder: 'Min. order ₹399',
    expiry: 'Valid for next 7 days',
    icon: 'volunteer_activism',
    bg: '#FFFFFF',
    textColor: '#1C3B2B',
    border: '1px solid #EAE6DC',
    badgeBg: '#EAF2E8',
    badgeColor: '#2E7D32',
    iconBg: '#EAF2E8',
    iconColor: '#2E7D32',
    btnBg: '#1C3B2B',
    btnColor: '#FFFFFF'
  },
  {
    id: 'off_4',
    badge: 'EXPRESS DELIVERY',
    title: 'FREE Doorstep Delivery',
    description: 'Enjoy free fast home delivery direct to your doorstep on orders above ₹199.',
    code: 'FREESHIP',
    minOrder: 'Min. order ₹199',
    expiry: 'Automatic at checkout',
    icon: 'local_shipping',
    bg: 'linear-gradient(135deg, #FAF5E8 0%, #F5EBD0 100%)',
    textColor: '#1C3B2B',
    border: '1px solid #E5D5AA',
    badgeBg: '#C29B38',
    badgeColor: '#FFFFFF',
    iconBg: '#FFFFFF',
    iconColor: '#C29B38',
    btnBg: '#1C3B2B',
    btnColor: '#FFFFFF'
  },
  {
    id: 'off_5',
    badge: 'BUNDLE SAVINGS',
    title: 'Flat ₹100 OFF Bundles',
    description: 'Save flat ₹100 when buying 2 or more Botanís organic superfood products together.',
    code: 'VITALITY100',
    minOrder: 'Min. order ₹899',
    expiry: 'Limited time offer',
    icon: 'stars',
    bg: 'linear-gradient(135deg, #0F2319 0%, #1C3B2B 100%)',
    textColor: '#FFFFFF',
    border: '1px solid #2E7D32',
    badgeBg: '#2E7D32',
    badgeColor: '#FFFFFF',
    iconBg: 'rgba(255, 255, 255, 0.12)',
    iconColor: '#C29B38',
    btnBg: '#C29B38',
    btnColor: '#1C3B2B'
  },
  {
    id: 'off_6',
    badge: 'PREPAID BENEFIT',
    title: 'Extra 5% Cashback',
    description: 'Pay via UPI, GPay, or Paytm to unlock extra 5% instant cashback reward in your wallet.',
    code: 'BOTANISUPI',
    minOrder: 'No Min Order Limit',
    expiry: 'Valid on digital payments',
    icon: 'account_balance_wallet',
    bg: '#FFFFFF',
    textColor: '#1C3B2B',
    border: '1px solid #EAE6DC',
    badgeBg: '#FAF5E8',
    badgeColor: '#C29B38',
    iconBg: '#FAF5E8',
    iconColor: '#C29B38',
    btnBg: '#1C3B2B',
    btnColor: '#FFFFFF'
  }
];

export default function Offers() {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err) {}
  };

  const handleCopyCode = (code) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).catch(() => fallbackCopy(code));
      } else {
        fallbackCopy(code);
      }
    } catch (err) {
      fallbackCopy(code);
    }
    setCopiedCode(code);
    setToastMsg(`Coupon code "${code}" copied to clipboard! 📋`);
    setTimeout(() => {
      setToastMsg('');
      setCopiedCode('');
    }, 2500);
  };

  return (
    <div className="app-container" style={{ background: '#F8F6F0', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      <Toast message={toastMsg} />

      <TopAppBar title="Exclusive Voucher Offers" showBack={true} />

      <main className="botanis-main-content" style={{ padding: '20px 20px 40px' }}>
        
        {/* Page Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1C3B2B 0%, #0F2319 100%)',
          borderRadius: '24px',
          padding: '24px 22px',
          color: '#FFFFFF',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(28, 59, 43, 0.2)'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              background: 'rgba(194, 155, 56, 0.25)',
              color: '#C29B38',
              padding: '4px 10px',
              borderRadius: '20px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(194, 155, 56, 0.4)'
            }}>
              BOTANÍS PROMOTIONS
            </span>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '8px 0 4px',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em'
            }}>
              Organic Wellness Coupons
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', margin: 0, fontWeight: 400 }}>
              Apply coupon codes at checkout for maximum savings
            </p>
          </div>

          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C29B38',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              confirmation_number
            </span>
          </div>
        </div>

        {/* Voucher Cards Grid */}
        <div className="botanis-voucher-grid">
          {OFFERS_LIST.map(offer => (
            <div
              key={offer.id}
              className="botanis-voucher-card"
              style={{
                background: offer.bg,
                color: offer.textColor,
                border: offer.border || 'none'
              }}
            >
              {/* Ticket Side Notch Cutouts */}
              <div className="botanis-voucher-notch-left" />
              <div className="botanis-voucher-notch-right" />

              {/* Top Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    background: offer.badgeBg,
                    color: offer.badgeColor,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    {offer.badge}
                  </span>

                  <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 600 }}>
                    {offer.minOrder}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '10px' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: offer.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: offer.iconColor,
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                      {offer.icon}
                    </span>
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      margin: '0 0 4px',
                      lineHeight: 1.25,
                      fontFamily: "'Outfit', sans-serif"
                    }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '12px', opacity: 0.88, margin: 0, lineHeight: 1.45, fontWeight: 400 }}>
                      {offer.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashed Perforated Ticket Line */}
              <div style={{
                margin: '18px -22px 16px',
                borderBottom: offer.textColor === '#FFFFFF' ? '1.5px dashed rgba(255,255,255,0.25)' : '1.5px dashed #D2E2CF',
                position: 'relative'
              }} />

              {/* Bottom Stub (Code & Action Buttons) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: offer.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.12)' : '#F4F1E8',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: offer.textColor === '#FFFFFF' ? '1px dashed rgba(255,255,255,0.3)' : '1px dashed #C29B38'
                }}>
                  <span style={{ fontSize: '8px', textTransform: 'uppercase', opacity: 0.75, fontWeight: 800, letterSpacing: '0.06em' }}>
                    COUPON CODE
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.08em', color: offer.textColor }}>
                    {offer.code}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    style={{
                      background: copiedCode === offer.code ? '#2E7D32' : offer.btnBg,
                      color: offer.btnColor,
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                      {copiedCode === offer.code ? 'check' : 'content_copy'}
                    </span>
                    {copiedCode === offer.code ? 'COPIED' : 'COPY'}
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    style={{
                      background: 'transparent',
                      color: offer.textColor,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: offer.textColor === '#FFFFFF' ? '1px solid rgba(255,255,255,0.4)' : '1px solid #1C3B2B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    USE NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
