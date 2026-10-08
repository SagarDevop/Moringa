import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'PURE • NATURAL • TRUSTED',
    title: '100% Organic Moringa Superfood',
    description: 'Boost natural energy & immunity directly from certified organic farms.',
    btnText: 'Shop Moringa',
    btnAction: '/product/botanis_moringa_leaf_powder',
    image: '/images/botanis/hero_moringa.webp',
    badgeText: '100% ORGANIC',
    badgeIcon: 'eco'
  },
  {
    id: 2,
    tag: 'WELCOME SPECIAL OFFER',
    title: 'Flat 15% OFF First Purchase',
    description: 'Use code BOTANIS15 at checkout for instant wellness savings.',
    btnText: 'Claim Voucher',
    btnAction: '/offers',
    image: '/images/botanis/promo_banner.webp',
    badgeText: 'SAVE 15%',
    badgeIcon: 'local_offer'
  },
  {
    id: 3,
    tag: 'NATURAL VITALITY & STRENGTH',
    title: 'Ashwagandha Premium Tablets',
    description: 'Reduce daily stress, boost stamina & revive your natural vitality.',
    btnText: 'Shop Ashwagandha',
    btnAction: '/product/botanis_ashwagandha_tablets',
    image: '/images/botanis/ashwagandha_tablets.webp',
    badgeText: 'BESTSELLER',
    badgeIcon: 'bolt'
  },
  {
    id: 4,
    tag: 'DAILY WELLNESS RANGE',
    title: 'Moringa Supplement Tablets',
    description: 'Convenient daily green superfood tablets for health & immunity.',
    btnText: 'Explore Range',
    btnAction: '/product/botanis_moringa_leaf_tablets',
    image: '/images/botanis/moringa_leaf_tablets.webp',
    badgeText: 'PURE EXTRACT',
    badgeIcon: 'verified'
  },
  {
    id: 5,
    tag: 'BOTANÍS PROMISE',
    title: 'Your Trusted Path to Healthy Living',
    description: '100% plant-based, lab-tested & chemical-free organic care.',
    btnText: 'Learn About Us',
    btnAction: '/about',
    image: '/images/botanis/hero_moringa.webp',
    badgeText: 'GUARANTEED',
    badgeIcon: 'shield'
  }
];

export default function HeroBannerCarousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section style={{ marginBottom: '24px', position: 'relative' }}>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '230px',
          boxShadow: '0 8px 24px rgba(28, 59, 43, 0.15)',
          background: '#1C3B2B'
        }}
      >
        {/* Carousel Slide Track */}
        <div style={{
          display: 'flex',
          width: `${HERO_SLIDES.length * 100}%`,
          transform: `translateX(-${(currentSlide * 100) / HERO_SLIDES.length}%)`,
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {HERO_SLIDES.map(slide => (
            <div
              key={slide.id}
              onClick={() => navigate(slide.btnAction)}
              style={{
                width: `${100 / HERO_SLIDES.length}%`,
                position: 'relative',
                minHeight: '230px',
                display: 'flex',
                alignItems: 'center',
                padding: '24px 22px',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              {/* Full Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: 1
                }}
              />

              {/* Dark Emerald Gradient Overlay for Perfect Legibility */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(15,35,25,0.92) 0%, rgba(15,35,25,0.75) 55%, rgba(15,35,25,0.4) 100%)',
                zIndex: 2
              }} />

              {/* Content Overlay */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#C29B38',
                    textTransform: 'uppercase',
                    background: 'rgba(194, 155, 56, 0.18)',
                    padding: '3px 9px',
                    borderRadius: '20px',
                    border: '1px solid rgba(194, 155, 56, 0.35)'
                  }}>
                    {slide.tag}
                  </span>
                </div>

                <h2 style={{
                  color: '#FFFFFF',
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  {slide.title}
                </h2>

                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.88)',
                  margin: '0 0 10px',
                  fontWeight: 400,
                  lineHeight: 1.35
                }}>
                  {slide.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(slide.btnAction);
                  }}
                  style={{
                    background: '#C29B38',
                    color: '#1C3B2B',
                    padding: '9px 18px',
                    borderRadius: '25px',
                    fontWeight: 800,
                    fontSize: '12px',
                    width: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  <span>{slide.btnText}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Right Seal Badge */}
              <div style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '50px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#C29B38' }}>
                  {slide.badgeIcon}
                </span>
                <span>{slide.badgeText}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Left & Right Arrow Navigation (Desktop/Hover) */}
        <button
          onClick={prevSlide}
          title="Previous slide"
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(28, 59, 43, 0.6)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
        </button>

        <button
          onClick={nextSlide}
          title="Next slide"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(28, 59, 43, 0.6)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
        </button>

        {/* Pagination Dots Bar */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 10px',
          borderRadius: '20px',
          backdropFilter: 'blur(6px)'
        }}>
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              title={`Go to slide ${index + 1}`}
              style={{
                width: index === currentSlide ? 18 : 7,
                height: 7,
                borderRadius: 4,
                background: index === currentSlide ? '#C29B38' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
