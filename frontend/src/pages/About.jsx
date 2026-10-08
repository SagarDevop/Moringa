import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import CartBar from '../components/CartBar';
import Footer from '../components/Footer';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ background: '#F8F6F0', minHeight: '100vh' }}>
      <TopAppBar title="About Botanís" showBack={true} />

      <main className="botanis-main-content" style={{ padding: '16px 16px 12px' }}>
        
        {/* Hero Banner Section */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1C3B2B 0%, #0D2217 100%)',
            padding: '28px 22px',
            color: '#FFFFFF',
            boxShadow: '0 6px 20px rgba(28, 59, 43, 0.15)',
            marginBottom: '20px'
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#C29B38',
              textTransform: 'uppercase'
            }}>
              OUR BRAND MISSION
            </span>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '6px 0 8px',
              fontFamily: "'Playfair Display', Georgia, serif"
            }}>
              Your Trusted Path to Healthy Living
            </h2>
            <p style={{ fontSize: '13px', color: '#EAF2E8', margin: 0, lineHeight: 1.5, fontWeight: 450 }}>
              Botanís was founded on a simple principle: harness the uncompromised healing power of nature to deliver 100% organic, chemical-free superfoods and dietary supplements for modern healthy living.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            textAlign: 'center'
          }}>
            <div style={{ background: '#FFFFFF', padding: '14px 8px', borderRadius: '16px', border: '1px solid #EAE6DC' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#1C3B2B', display: 'block' }}>100%</span>
              <span style={{ fontSize: '10px', color: '#667085', fontWeight: 600 }}>Organic & Pure</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '14px 8px', borderRadius: '16px', border: '1px solid #EAE6DC' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#1C3B2B', display: 'block' }}>0%</span>
              <span style={{ fontSize: '10px', color: '#667085', fontWeight: 600 }}>Chemical Additives</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '14px 8px', borderRadius: '16px', border: '1px solid #EAE6DC' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#1C3B2B', display: 'block' }}>50k+</span>
              <span style={{ fontSize: '10px', color: '#667085', fontWeight: 600 }}>Happy Customers</span>
            </div>
          </div>
        </section>

        {/* Story Chapters */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chapter 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px 18px',
            border: '1px solid #EAE6DC',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              height: 160,
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src="/images/botanis/hero_moringa.jpg"
                alt="Organic Moringa Sourcing"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C3B2B', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Chapter 1: The Miracle of Moringa
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475467', margin: 0, lineHeight: 1.6 }}>
              Known as the "Tree of Life", Moringa Oleifera contains over 92 nutrients, 46 antioxidants, and essential amino acids. At Botanís, we carefully hand-harvest nutrient-dense moringa leaves at dawn to lock in maximum potency.
            </p>
          </div>

          {/* Chapter 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px 18px',
            border: '1px solid #EAE6DC',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              height: 160,
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src="/images/botanis/promo_banner.jpg"
                alt="Quality Assured Supplement Formulations"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C3B2B', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Chapter 2: Quality & Science Assured
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475467', margin: 0, lineHeight: 1.6 }}>
              Every batch of Botanís powders, tablets, and extracts undergoes rigorous lab testing to ensure zero heavy metals, zero pesticides, and zero artificial preservatives. Clean, bio-available nutrition you can trust every day.
            </p>
          </div>

          {/* Chapter 3 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '20px 18px',
            border: '1px solid #EAE6DC',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              height: 160,
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img
                src="/images/botanis/moringa_leaf_tablets.jpg"
                alt="Botanís Daily Health Commitment"
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#F8F6F0' }}
              />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C3B2B', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Chapter 3: Empowering Your Daily Health
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475467', margin: 0, lineHeight: 1.6 }}>
              Whether you need natural energy, stress relief, joint support, or gut detox, Botanís provides easy-to-use daily formulations designed to fit seamlessly into your active lifestyle.
            </p>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{
          textAlign: 'center',
          marginTop: '28px',
          padding: '24px 20px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #EAF2E8 0%, #D8E8D5 100%)',
          border: '1px solid #D2E2CF',
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#1C3B2B', margin: '0 0 6px', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Begin Your Natural Wellness Journey
          </h4>
          <p style={{ fontSize: '12px', color: '#475467', marginBottom: '16px', fontWeight: 500 }}>
            Discover pure organic moringa powders & wellness tablets today.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#1C3B2B',
              color: '#FFFFFF',
              padding: '12px 28px',
              borderRadius: '25px',
              fontWeight: 800,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(28, 59, 43, 0.2)'
            }}
          >
            Explore Botanís Products
          </button>
        </section>

      </main>

      <Footer />
      <CartBar />
      <BottomNav />
    </div>
  );
}
