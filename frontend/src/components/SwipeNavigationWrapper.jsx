import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TAB_ROUTES = ['/', '/offers', '/cart', '/about'];

export default function SwipeNavigationWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    // Check if touch started on an interactive element or slider where swipe should be ignored
    const target = e.target;
    if (
      target.closest(
        'input, textarea, select, button, .botanis-hero-card, [data-no-swipe="true"], .no-scrollbar'
      )
    ) {
      touchStartX.current = 0;
      touchStartY.current = 0;
      return;
    }

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Ensure swipe distance is at least 70px and predominantly horizontal (not vertical scrolling)
    if (Math.abs(diffX) > 70 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      const currentPath = location.pathname;
      const currentIndex = TAB_ROUTES.indexOf(currentPath);

      if (currentIndex !== -1) {
        if (diffX > 0 && currentIndex < TAB_ROUTES.length - 1) {
          // Swipe Left -> Next Tab (e.g. Home -> Offers -> Cart -> About)
          navigate(TAB_ROUTES[currentIndex + 1]);
        } else if (diffX < 0 && currentIndex > 0) {
          // Swipe Right -> Previous Tab (e.g. About -> Cart -> Offers -> Home)
          navigate(TAB_ROUTES[currentIndex - 1]);
        }
      }
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ width: '100%', minHeight: '100dvh' }}
    >
      {children}
    </div>
  );
}
