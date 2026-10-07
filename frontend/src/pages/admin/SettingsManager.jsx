import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

export default function SettingsManager() {
  const navigate = useNavigate();
  const { whatsappNumber, updateWhatsappNumber } = useProducts();
  const [numberInput, setNumberInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (whatsappNumber) {
      setNumberInput(whatsappNumber);
    }
  }, [whatsappNumber]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!numberInput.trim()) {
      setError('WhatsApp number cannot be empty.');
      return;
    }
    
    // Strip non-digits to check validity
    const stripped = numberInput.replace(/\D/g, '');
    if (stripped.length < 8) {
      setError('Please enter a valid phone number (minimum 8 digits).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateWhatsappNumber(numberInput);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update WhatsApp number. Please check connection.');
    } finally {
      setLoading(false);
    }
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
          <button onClick={() => navigate('/admin/dashboard')} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>arrow_back</span>
          </button>
          <h1 className="text-headline-lg-mobile" style={{ color: 'var(--primary)', margin: 0 }}>Store Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 'var(--space-lg) var(--container-padding)' }}>
        <div style={{
          background: 'var(--surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(194,201,187,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          animation: 'fadeInUp 0.3s ease forwards'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', borderBottom: '1px solid var(--outline-variant)', paddingBottom: 'var(--space-md)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 28 }}>
              chat_bubble
            </span>
            <h2 className="text-title-md" style={{ margin: 0, color: 'var(--on-surface)' }}>WhatsApp Configuration</h2>
          </div>

          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', fontSize: 13, lineHeight: '20px', margin: 0 }}>
            Configure the default WhatsApp business phone number where customer checkout order sheets will be delivered.
          </p>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: 'var(--space-xs)' }}>
            <div>
              <label htmlFor="whatsapp_num" className="text-label-sm" style={{ display: 'block', color: 'var(--on-surface-variant)', marginBottom: 6, fontWeight: 600 }}>
                Order Receipt WhatsApp Number *
              </label>
              
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--primary)',
                  fontSize: 20
                }}>
                  phone
                </span>
                <input
                  id="whatsapp_num"
                  type="text"
                  value={numberInput}
                  onChange={(e) => {
                    setNumberInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. +91 70163 71119"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 15,
                    color: 'var(--on-surface)',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>
              
              <span style={{ display: 'block', fontSize: 11, color: 'var(--outline)', marginTop: 6, lineHeight: 1.4 }}>
                💡 Enter international format with country code (e.g. <code>+91 70163 71119</code> or <code>917016371119</code>). All letters, spaces, and punctuation will be sanitized on save.
              </span>
            </div>

            {/* Status alerts */}
            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(45,138,78,0.1)',
                color: '#2d8a4e',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid rgba(45,138,78,0.2)',
                animation: 'fadeIn 0.2s'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                WhatsApp number updated successfully!
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--error-container)',
                color: 'var(--on-error-container)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid rgba(186,26,26,0.2)',
                animation: 'fadeIn 0.2s'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--primary)',
                color: 'var(--on-primary)',
                border: 'none',
                padding: '12px var(--space-lg)',
                borderRadius: 'var(--radius-xl)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.2s',
                opacity: loading ? 0.8 : 1,
                alignSelf: 'stretch',
                marginTop: 'var(--space-xs)'
              }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span>
                  Saving Settings...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                  Save Configuration
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
