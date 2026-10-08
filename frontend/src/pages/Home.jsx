import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import Logo from '../components/Logo';
import BotanisProductCard from '../components/BotanisProductCard';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import HeroBannerCarousel from '../components/HeroBannerCarousel';
import { BOTANIS_PRODUCTS } from '../data/botanisProducts';

export default function Home() {
  const navigate = useNavigate();
  const { whatsappNumber } = useProducts();
  const { totalItems } = useCart();
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const displayBotanIsProducts = BOTANIS_PRODUCTS;

  return (
    <div className="app-container" style={{
      background: '#F8F6F0',
      color: '#1C3B2B',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative',
    }}>
      {/* Toast Feedback */}
      <Toast message={toastMsg} />

      {/* =========================================================================
          1. HEADER
          ========================================================================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 80,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        background: '#F8F6F0',
        borderBottom: '1px solid #EAE6DC',
      }}>
        {/* Top Left: Hamburger Menu Icon & Botanis Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #EAE6DC',
              color: '#1C3B2B',
              cursor: 'default'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>menu</span>
          </button>

          {/* Botanis Brand Logo & Tagline */}
          <Logo type="full" size={26} />
        </div>

        {/* Top Right: Profile/Account icon only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/about')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #EAE6DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1C3B2B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(28, 59, 43, 0.04)'
            }}
            title="Account"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              person
            </span>
          </button>
        </div>
      </header>

      <main className="botanis-main-content">

        {/* =========================================================================
            2. SEARCH BAR
            ========================================================================= */}
        <section style={{ marginTop: '16px', marginBottom: '20px' }}>
          <div
            onClick={() => navigate('/search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: '1.5px solid #EAE6DC',
              borderRadius: '28px',
              padding: '0 20px',
              height: 48,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(28, 59, 43, 0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#667085', fontSize: '14px' }}>
              <span className="material-symbols-outlined" style={{ color: '#1C3B2B', fontSize: 22 }}>
                search
              </span>
              <span style={{ color: '#667085', fontWeight: 450 }}>
                Search for products, health goals...
              </span>
            </div>

            <span className="material-symbols-outlined" style={{ color: '#1C3B2B', fontSize: 22 }}>
              tune
            </span>
          </div>
        </section>

        {/* =========================================================================
            3. DYNAMIC HERO BANNER CAROUSEL
            ========================================================================= */}
        <HeroBannerCarousel />

        {/* =========================================================================
            4. TRUST / BRAND BENEFITS STRIP
            ========================================================================= */}
        <section style={{
          marginBottom: '28px',
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '16px 12px',
          border: '1px solid #EAE6DC',
          boxShadow: '0 2px 10px rgba(28, 59, 43, 0.02)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C3B2B', marginBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>eco</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 750, color: '#1C3B2B', lineHeight: 1.15 }}>
                100%<br />Natural
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid #EAE6DC' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C3B2B', marginBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>local_florist</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 750, color: '#1C3B2B', lineHeight: 1.15 }}>
                Plant<br />Based
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid #EAE6DC' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C3B2B', marginBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>science</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 750, color: '#1C3B2B', lineHeight: 1.15 }}>
                Chemical<br />Free
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid #EAE6DC' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C3B2B', marginBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>verified_user</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 750, color: '#1C3B2B', lineHeight: 1.15 }}>
                Quality<br />Assured
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderLeft: '1px solid #EAE6DC' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1C3B2B', marginBottom: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>favorite</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 750, color: '#1C3B2B', lineHeight: 1.15 }}>
                Safe for<br />All Ages
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. PRODUCTS SECTION
            ========================================================================= */}
        <section style={{ marginBottom: '32px' }}>
          {/* Header Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '14px'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1C3B2B',
                margin: 0,
                lineHeight: 1.2
              }}>
                Our Products
              </h3>
              <span style={{ fontSize: '12px', color: '#667085', fontWeight: 500 }}>
                Wellness in every form
              </span>
            </div>
          </div>

          {/* Products Grid: 3 per row on mobile, 5 per row on desktop */}
          <div className="botanis-products-grid">
            {displayBotanIsProducts.map(product => (
              <BotanisProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. WELLNESS PROMOTIONAL BANNER
            ========================================================================= */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1C3B2B 0%, #0D2217 100%)',
            padding: '24px 22px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 6px 24px rgba(28, 59, 43, 0.15)'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.25,
              backgroundImage: `url('/images/botanis/promo_banner.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay'
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                margin: '0 0 4px',
                color: '#FFFFFF',
                fontFamily: "'Playfair Display', Georgia, serif",
                letterSpacing: '-0.01em'
              }}>
                Pure & Natural
              </h3>

              <p style={{
                fontSize: '11.5px',
                color: '#EAF2E8',
                margin: '0 0 10px',
                fontWeight: 450,
                lineHeight: 1.3
              }}>
                100% Organic Superfoods
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
                  Lab Tested Organic
                </span>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 2, width: '28%' }}>
              <img
                src="/images/botanis/moringa_leaf_powder.webp"
                alt="Natural Moringa Powder"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. WHATSAPP SUPPORT CTA
            ========================================================================= */}
        <section style={{ marginBottom: '10px' }}>
          <div style={{
            background: '#1C3B2B',
            borderRadius: '24px',
            padding: '16px 20px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(28, 59, 43, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  chat
                </span>
              </div>

              <div style={{ lineHeight: 1.25 }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px', color: '#FFFFFF' }}>
                  Need Help or Product Guidance?
                </h4>
                <p style={{ fontSize: '11px', color: '#D2E2CF', margin: 0 }}>
                  Chat with us on WhatsApp
                </p>
              </div>
            </div>

            <button
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
              style={{
                background: '#FFFFFF',
                color: '#1C3B2B',
                padding: '10px 18px',
                borderRadius: '25px',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <span>Chat Now</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </div>
        </section>

      </main>

      <Footer />
      <CartBar />
      <BottomNav />
    </div>
  );
}
