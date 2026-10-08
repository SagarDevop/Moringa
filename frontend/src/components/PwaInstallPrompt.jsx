import React, { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // 2. Check if user already dismissed prompt previously
    const isDismissed = localStorage.getItem('botanis_pwa_dismissed');
    if (isDismissed) return;

    // 3. Detect mobile viewport / device
    const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!isMobile) return;

    // 4. Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      // Show prompt on mobile iOS after 2.5 seconds delay
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    // 5. Android / Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Delay prompt slightly for a smooth non-intrusive entrance
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('botanis_pwa_dismissed', 'installed');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      setShowIosGuide(!showIosGuide);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('botanis_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: '440px',
      zIndex: 999,
      animation: 'slideUpPrompt 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slideUpPrompt {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div style={{
        background: '#1C3B2B',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '14px 16px',
        boxShadow: '0 12px 32px rgba(28, 59, 43, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* App Icon */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          <img src="/icons/icon-192.png" alt="Botanís" style={{ width: 34, height: 34, borderRadius: '8px' }} />
        </div>

        {/* Text Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13.5px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            lineHeight: 1.2
          }}>
            Install Botanís App
          </div>
          <div style={{
            fontSize: '11px',
            color: '#D2E2CF',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Fast, offline & instant wellness access
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={handleInstallClick}
            style={{
              background: '#C29B38',
              color: '#1C3B2B',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            Install
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#D2E2CF',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* iOS Instructions Tooltip */}
      {showIosGuide && (
        <div style={{
          marginTop: '8px',
          background: '#FFFFFF',
          color: '#1C3B2B',
          borderRadius: '14px',
          padding: '12px 14px',
          fontSize: '11.5px',
          border: '1px solid #EAE6DC',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          lineHeight: 1.4
        }}>
          Tap <strong>Share</strong> <span style={{ fontSize: '14px' }}>⎋</span> at the bottom of Safari, then select <strong>'Add to Home Screen'</strong> ➕.
        </div>
      )}
    </div>
  );
}
