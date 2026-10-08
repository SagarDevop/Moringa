import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Toast from './Toast';

function FooterLink({ onClick, children }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: '13px',
        color: hover ? '#ffffff' : '#D2E2CF',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        textAlign: 'left',
        width: 'fit-content',
      }}
    >
      {children}
    </span>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      triggerToast('Please enter a valid email address');
      return;
    }

    triggerToast('Thank you for subscribing to Botanís newsletter!');
    setEmail('');
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePlaceholderLink = (e, name) => {
    e.preventDefault();
    triggerToast(`"${name}" page will be available soon!`);
  };

  return (
    <footer 
      className="botanis-footer"
      style={{
        width: '100%',
        background: '#1C3B2B',
        color: '#EAF2E8',
        padding: '40px 24px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: "'Inter', sans-serif",
        marginTop: 'auto'
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        {/* Footer Top: Multi-Column Grid on PC */}
        <div className="botanis-footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
        }}>
          {/* Column 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Logo type="full" size={32} style={{ cursor: 'pointer', marginBottom: '12px' }} />
            
            <p style={{ 
              fontSize: '13px', 
              color: '#D2E2CF', 
              lineHeight: '1.6', 
              margin: '0 0 16px 0',
              textAlign: 'left',
              maxWidth: '300px'
            }}>
              Your trusted path to healthy living. 100% pure organic moringa superfoods, herbal supplements, and natural wellness products.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={socialLinkStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#2E7D32';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={socialLinkStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#2E7D32';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={columnTitleStyle}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink onClick={() => navigate('/')}>Home</FooterLink>
              <FooterLink onClick={() => navigate('/offers')}>Special Offers</FooterLink>
              <FooterLink onClick={() => navigate('/about')}>About Botanís</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Track Order')}>Track Order</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Privacy Policy')}>Privacy Policy</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Terms & Conditions')}>Terms & Conditions</FooterLink>
            </div>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h4 style={columnTitleStyle}>Customer Care</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Help & Guidance')}>Help & Guidance</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Quality Assurance')}>Quality Guarantee</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Shipping Policy')}>Shipping Policy</FooterLink>
              <FooterLink onClick={(e) => handlePlaceholderLink(e, 'Return Policy')}>Return Policy</FooterLink>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 style={columnTitleStyle}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={contactItemStyle}>
                <span className="material-symbols-outlined" style={contactIconStyle}>location_on</span>
                <span style={contactTextStyle}>Botanís Health & Wellness, Gujarat</span>
              </div>
              <div style={contactItemStyle}>
                <span className="material-symbols-outlined" style={contactIconStyle}>call</span>
                <a href="tel:+917016371119" style={{ ...contactTextStyle, textDecoration: 'none', color: '#D2E2CF' }}>+91 70163 71119</a>
              </div>
              <div style={contactItemStyle}>
                <span className="material-symbols-outlined" style={contactIconStyle}>mail</span>
                <a href="mailto:support@botanis.in" style={{ ...contactTextStyle, textDecoration: 'none', color: '#D2E2CF' }}>support@botanis.in</a>
              </div>
            </div>
          </div>

          {/* Column 5: Subscribe */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h4 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '6px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Subscribe for Wellness Tips
            </h4>
            <p style={{ fontSize: '11.5px', color: '#D2E2CF', marginBottom: '12px', textAlign: 'left', lineHeight: 1.4 }}>
              Get exclusive wellness guides, health tips, and special product offers.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', width: '100%', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#1C3B2B',
                  flex: '1 1 180px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#2E7D32',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1b5e20'}
                onMouseLeave={e => e.currentTarget.style.background = '#2E7D32'}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Area */}
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: '#D2E2CF',
        }}>
          <span>© 2026 Botanís. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontStyle: 'italic' }}>
            Your Trusted Path to Healthy Living
          </span>
        </div>
      </div>

      {/* Custom Local Toast */}
      <Toast message={showToast ? toastMsg : ''} />
    </footer>
  );
}

// Resusable Styles
const socialLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  transition: 'all 0.2s ease',
};

const columnTitleStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '13px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '14px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  textAlign: 'left',
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const contactIconStyle = {
  color: '#2E7D32',
  fontSize: '18px',
};

const contactTextStyle = {
  fontSize: '13px',
  color: '#D2E2CF',
  textAlign: 'left',
};
