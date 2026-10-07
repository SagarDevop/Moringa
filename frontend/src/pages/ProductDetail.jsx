import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { APP_CONFIG } from '../data/sampleData';
import { optimizeImageUrl, preloadImage } from '../utils/image';
import Toast from '../components/Toast';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, loading } = useProducts();
  const { addItem, getItemQuantity, increment, decrement, totalItems } = useCart();
  
  const product = getProduct(productId);
  const hasVariants = product && product.sizes && product.sizes.length > 0;
  
  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes && product.sizes.length > 0 ? product.sizes[0].size : ''
  );
  const [activeImage, setActiveImage] = useState(product ? product.image : '');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('highlights'); // 'highlights' | 'specs' | 'nutrition'

  // Current display image URL
  const currentDisplayImage = activeImage || (product ? product.image : '');

  const qty = getItemQuantity(productId, hasVariants ? selectedSize : undefined);
  const [localQty, setLocalQty] = useState(Math.max(1, qty));
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Bundle companions state for Frequently Bought Together
  const [selectedBundleIds, setSelectedBundleIds] = useState([]);

  const mainImgRef = useRef(null);
  const prevProductIdRef = useRef(null);

  useEffect(() => {
    if (product) {
      const isNewProduct = prevProductIdRef.current !== product.id;
      prevProductIdRef.current = product.id;

      if (isNewProduct) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveImage(product.image || '');
        setIsImageLoaded(false);
        const initialSize = product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '';
        setSelectedSize(initialSize);
        setAdding(false);
        setAdded(false);
        
        // Warm up and prefetch all gallery images in parallel
        const imgs = [product.image, product.image1, product.image2, product.image3].filter(Boolean);
        imgs.forEach(img => preloadImage(img, 500));

        // Select 2 complementary items for bundle
        const companions = products
          .filter(p => p.id !== product.id && p.available && (p.category === product.category || p.featured))
          .slice(0, 2);
        setSelectedBundleIds(companions.map(c => c.id));
      }
    }
  }, [product?.id, products]);

  // Synchronize with preloaded / cached image completion status
  useEffect(() => {
    if (mainImgRef.current && mainImgRef.current.complete && mainImgRef.current.naturalWidth > 0) {
      setIsImageLoaded(true);
    }
  }, [currentDisplayImage]);

  useEffect(() => {
    setLocalQty(Math.max(1, qty));
  }, [selectedSize, qty]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Collect all real images belonging to this product
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      product.image,
      product.image1,
      product.image2,
      product.image3
    ].filter(Boolean);
    return imgs;
  }, [product]);

  // Price calculations
  const activeVariant = hasVariants && selectedSize
    ? product.sizes.find(s => s.size === selectedSize) || product.sizes[0]
    : null;

  const currentPrice = activeVariant ? activeVariant.price : (product ? product.price : 0);
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : (product ? product.originalPrice : 0);

  const hasOriginal = activeVariant
    ? (currentOriginalPrice && currentOriginalPrice > currentPrice)
    : (product ? (product.originalPrice && product.originalPrice > product.price) : false);

  const discountPercent = product ? (hasOriginal
    ? Math.round((((activeVariant ? currentOriginalPrice : product.originalPrice) - currentPrice) / (activeVariant ? currentOriginalPrice : product.originalPrice)) * 100)
    : ((currentPrice % 3 === 0) ? 22 : (currentPrice % 2 === 0) ? 15 : 18)) : 0;

  const originalPrice = product ? (hasOriginal
    ? (activeVariant ? currentOriginalPrice : product.originalPrice)
    : Math.round(currentPrice / (1 - (discountPercent / 100)))) : 0;

  const savingsAmount = originalPrice - currentPrice;

  // Pairs Well With / Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id && p.available)
      .slice(0, 6);
  }, [product, products]);

  // Frequently Bought Together candidates (Bundle items)
  const bundleCompanions = useMemo(() => {
    if (!product) return [];
    const pool = products.filter(p => p.id !== product.id && p.available);
    const sameCat = pool.filter(p => p.category === product.category);
    const otherFeatured = pool.filter(p => p.category !== product.category && p.featured);
    const candidates = [...sameCat, ...otherFeatured].slice(0, 2);
    return candidates;
  }, [product, products]);

  // Bundle calculations
  const bundleItems = useMemo(() => {
    if (!product) return [];
    const mainItem = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: originalPrice,
      image: currentDisplayImage,
      unit: hasVariants ? selectedSize : product.unit,
      isMain: true
    };
    const compItems = bundleCompanions.map(c => {
      const cHasVar = c.sizes && c.sizes.length > 0;
      const cVar = cHasVar ? c.sizes[0] : null;
      const cPrice = cVar ? cVar.price : c.price;
      const cOrig = cVar && cVar.originalPrice ? cVar.originalPrice : (c.originalPrice || Math.round(cPrice * 1.2));
      return {
        id: c.id,
        name: c.name,
        price: cPrice,
        originalPrice: cOrig,
        image: c.image,
        unit: cVar ? cVar.size : c.unit,
        rawProduct: c,
        isMain: false
      };
    });
    return [mainItem, ...compItems];
  }, [product, currentPrice, originalPrice, currentDisplayImage, hasVariants, selectedSize, bundleCompanions]);

  const activeBundleItems = bundleItems.filter(item => item.isMain || selectedBundleIds.includes(item.id));
  const bundleTotalPrice = activeBundleItems.reduce((sum, item) => sum + item.price, 0);
  const bundleTotalOriginal = activeBundleItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const bundleSavings = bundleTotalOriginal - bundleTotalPrice;

  const handleToggleBundleCompanion = (id) => {
    setSelectedBundleIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddBundleToCart = () => {
    // Add main product
    const mainCartProduct = {
      ...product,
      price: currentPrice,
      originalPrice: originalPrice,
    };
    if (hasVariants) {
      mainCartProduct.selectedSize = selectedSize;
    }
    addItem(mainCartProduct);

    // Add selected companions
    bundleCompanions.forEach(c => {
      if (selectedBundleIds.includes(c.id)) {
        const cHasVar = c.sizes && c.sizes.length > 0;
        const cVar = cHasVar ? c.sizes[0] : null;
        const compCartProd = {
          ...c,
          price: cVar ? cVar.price : c.price,
          originalPrice: cVar && cVar.originalPrice ? cVar.originalPrice : c.originalPrice
        };
        if (cHasVar) {
          compCartProd.selectedSize = cVar.size;
        }
        addItem(compCartProd);
      }
    });

    showToast(`🛒 Added ${activeBundleItems.length} items bundle to cart!`);
  };

  const handleAddToCart = () => {
    if (qty > 0) return;
    setAdding(true);

    const cartProduct = {
      ...product,
      price: currentPrice,
      originalPrice: originalPrice,
    };
    if (hasVariants) {
      cartProduct.selectedSize = selectedSize;
    }

    addItem(cartProduct);
    
    const itemKey = hasVariants ? `${product.id}_${selectedSize}` : product.id;
    for (let i = 1; i < localQty; i++) {
      increment(itemKey);
    }
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      showToast('Item added to cart!');
      setTimeout(() => setAdded(false), 1500);
    }, 300);
  };

  const handleBuyNow = () => {
    if (qty === 0) {
      const cartProduct = {
        ...product,
        price: currentPrice,
        originalPrice: originalPrice,
      };
      if (hasVariants) {
        cartProduct.selectedSize = selectedSize;
      }
      addItem(cartProduct);
    }
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - Botanís`,
          text: `Check out ${product.name} for ₹${currentPrice} on Botanís!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Product link copied to clipboard!');
    }
  };

  const itemKey = hasVariants ? `${product.id}_${selectedSize}` : product.id;

  if (loading && !product) {
    return (
      <div className="app-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', flexDirection: 'column', gap: 16, background: '#f8fafc'
      }}>
        <div className="animate-spin" style={{
          width: 36, height: 36, border: '3px solid #e2e8f0',
          borderTop: '3px solid var(--primary)', borderRadius: '50%'
        }} />
        <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, margin: 0 }}>
          Loading Product Details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh', flexDirection: 'column', gap: 'var(--space-md)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--surface-container-high)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'var(--outline)' }}>
            inventory_2
          </span>
        </div>
        <h2 className="text-headline-md" style={{ color: 'var(--on-surface)', margin: 0 }}>
          Product Not Found
        </h2>
        <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', textAlign: 'center', maxWidth: 300 }}>
          The item you are looking for might be unavailable or removed from our catalog.
        </p>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 28px',
          background: 'var(--primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(45, 138, 78, 0.3)'
        }}>
          Explore Store
        </button>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ paddingBottom: 110, background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      <Toast message={toastMsg} />

      {/* Fullscreen Image Zoom Modal */}
      {isZoomOpen && currentDisplayImage && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <button 
            onClick={() => setIsZoomOpen(false)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: 44,
              height: 44,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
          </button>
          <img 
            src={optimizeImageUrl(currentDisplayImage, 1200)}
            alt={product.name}
            style={{ maxWidth: '95%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
          />
        </div>
      )}

      {/* Flipkart / Amazon Style Mobile App Bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 'var(--z-header)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        background: '#ffffff',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--outline-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1e293b', fontSize: 20 }}>arrow_back</span>
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {product.category.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => navigate('/search')}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--surface-container-low)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: 20 }}>search</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--surface-container-low)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: 20 }}>share</span>
          </button>

          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              showToast(!isWishlisted ? '❤️ Added to your Wishlist' : 'Removed from Wishlist');
            }}
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: isWishlisted ? '#ffe4e6' : 'var(--surface-container-low)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
          >
            <span className={`material-symbols-outlined ${isWishlisted ? 'filled' : ''}`} 
              style={{ color: isWishlisted ? '#e11d48' : '#475569', fontSize: 20 }}>
              favorite
            </span>
          </button>

          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'var(--surface-container-low)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1e293b', fontSize: 20 }}>shopping_cart</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#ff3f6c',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 800,
                width: 18,
                height: 18,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Product Showcase Section (Amazon / Flipkart Card) */}
      <div style={{ paddingTop: 58 }}>
        <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          
          {/* Main Visual Frame */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.05',
            background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f8fafc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'hidden'
          }}>
            {/* Badges Overlay */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              zIndex: 5
            }}>
              {/* Flipkart Assured Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'linear-gradient(135deg, #15803d, #166534)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: 11,
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)',
                letterSpacing: '0.03em'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontWeight: 'bold' }}>verified</span>
                <span>Botanís Assured</span>
              </div>

              {/* Express Speed Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#fffbeb',
                color: '#b45309',
                border: '1px solid #fde68a',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: 10.5,
                fontWeight: 700
              }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: 13, color: '#f59e0b' }}>bolt</span>
                <span>15-Min Delivery</span>
              </div>
            </div>

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                background: '#e11d48',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
                letterSpacing: '0.02em',
                zIndex: 5
              }}>
                {discountPercent}% OFF
              </div>
            )}

            {/* Zoom / Tap to Inspect */}
            {currentDisplayImage && (
              <button
                onClick={() => setIsZoomOpen(true)}
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  zIndex: 5
                }}
                title="Tap to zoom"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#334155' }}>zoom_in</span>
              </button>
            )}

            {/* Skeleton / Shimmer loading placeholder for image */}
            {!isImageLoaded && currentDisplayImage && (
              <div style={{
                position: 'absolute',
                inset: 20,
                borderRadius: 12,
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#94a3b8', opacity: 0.5 }}>
                  image
                </span>
              </div>
            )}

            {/* Product Image */}
            {currentDisplayImage ? (
              <img
                ref={mainImgRef}
                src={optimizeImageUrl(currentDisplayImage, 500, 'good')}
                alt={product.name}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
                onClick={() => setIsZoomOpen(true)}
                style={{
                  maxWidth: '92%',
                  maxHeight: '92%',
                  objectFit: 'contain',
                  transition: 'opacity 0.2s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: isImageLoaded ? 1 : 0,
                  cursor: 'zoom-in'
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#94a3b8'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>shopping_bag</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{product.name}</span>
              </div>
            )}
          </div>

          {/* Amazon / Flipkart Multi-Image Thumbnail Reel */}
          {allImages.length > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '10px 16px 14px',
              borderTop: '1px solid #f1f5f9'
            }}>
              {allImages.map((imgUrl, idx) => {
                const isSelected = (activeImage || product.image) === imgUrl;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImage(imgUrl);
                      setIsImageLoaded(false);
                    }}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--primary)' : '1.5px solid #e2e8f0',
                      background: '#ffffff',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 3,
                      boxShadow: isSelected ? '0 2px 10px rgba(45, 138, 78, 0.25)' : 'none',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={optimizeImageUrl(imgUrl, 120, 'low')}
                      alt={`${product.name} view ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Title, Rating & Pricing Block */}
        <div style={{ background: '#ffffff', padding: '16px', marginTop: 8, borderBottom: '1px solid #e2e8f0' }}>
          {/* Category Chip & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Botanís Wellness &bull; {product.category.replace('_', ' ')}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: product.available ? '#16a34a' : '#dc2626',
              background: product.available ? '#f0fdf4' : '#fef2f2',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {product.available ? '● In Stock' : '✕ Out of Stock'}
            </span>
          </div>

          {/* Product Name */}
          <h1 style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px',
            lineHeight: 1.3
          }}>
            {product.name}
          </h1>

          {/* Rating and Reviews Bar (Amazon / Flipkart style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              background: '#15803d',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: 12,
              fontWeight: 800
            }}>
              <span>4.8</span>
              <span className="material-symbols-outlined filled" style={{ fontSize: 12 }}>star</span>
            </div>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              1,420 Ratings &bull; 280+ Reviews
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              background: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: 'auto'
            }}>
              #1 Bestseller
            </span>
          </div>

          {/* Price Layout */}
          <div style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              {discountPercent > 0 && (
                <span style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#dc2626',
                  letterSpacing: '-0.02em'
                }}>
                  -{discountPercent}%
                </span>
              )}

              <span style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.03em'
              }}>
                ₹{currentPrice}
              </span>

              {originalPrice > currentPrice && (
                <span style={{
                  fontSize: 15,
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  fontWeight: 500
                }}>
                  M.R.P.: ₹{originalPrice}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11.5, color: '#64748b' }}>
                Inclusive of all taxes &bull; {hasVariants ? `Option: ${selectedSize}` : `Unit: ${product.unit}`}
              </span>
              {savingsAmount > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
                  You Save ₹{savingsAmount}
                </span>
              )}
            </div>
          </div>

          {/* Size / Variant Selector (Flipkart & Amazon Pill Grid) */}
          {hasVariants && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
                  Select Pack / Weight Size:
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                  {selectedSize}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 10
              }}>
                {product.sizes.map((variant) => {
                  const isSelected = selectedSize === variant.size;
                  const vOrig = variant.originalPrice || Math.round(variant.price * 1.25);
                  const vDiscount = Math.round(((vOrig - variant.price) / vOrig) * 100);

                  return (
                    <div
                      key={variant.size}
                      onClick={() => setSelectedSize(variant.size)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--primary)' : '1.5px solid #e2e8f0',
                        background: isSelected ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: isSelected ? '0 2px 8px rgba(45, 138, 78, 0.15)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10
                        }}>
                          ✓
                        </div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--primary)' : '#1e293b' }}>
                        {variant.size}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                          ₹{variant.price}
                        </span>
                        {vOrig > variant.price && (
                          <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{vOrig}
                          </span>
                        )}
                      </div>
                      {vDiscount > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', marginTop: 2 }}>
                          {vDiscount}% off
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bank & Promotional Offers Box (Flipkart Style) */}
          <div style={{
            border: '1px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '12px',
            background: '#fafafa',
            marginBottom: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f59e0b' }}>local_offer</span>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0f172a' }}>Available Offers & Deals</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: '#475569', lineHeight: 1.6 }}>
              <li><strong>UPI Offer:</strong> Extra 5% instant cashback on UPI payments.</li>
              <li><strong>Free Delivery:</strong> Enjoy FREE doorstep delivery on orders above ₹199.</li>
              <li><strong>Freshness Promise:</strong> 100% replacement or refund if not satisfied at delivery.</li>
            </ul>
          </div>

          {/* Delivery & Pincode Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>
              location_on
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                Delivering to Gujarat (380001)
              </div>
              <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                ⚡ Express Delivery in <strong>{APP_CONFIG.deliveryTime || '15-25 mins'}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* 🌟 Amazon & Flipkart Style "Frequently Bought Together" (Pairs Well With) */}
        {bundleCompanions.length > 0 && (
          <div style={{
            background: '#ffffff',
            padding: '16px',
            marginTop: 8,
            borderTop: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Frequently Bought Together
                </h3>
                <span style={{ fontSize: 11.5, color: '#64748b' }}>
                  अक्सर साथ में खरीदे जाने वाले आइटम (Bundle Deal)
                </span>
              </div>
              <span style={{
                fontSize: 10.5,
                fontWeight: 800,
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                Save Extra
              </span>
            </div>

            {/* Visual Bundle Equation Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              overflowX: 'auto',
              padding: '6px 2px 14px',
            }} className="no-scrollbar">
              {bundleItems.map((item, index) => {
                const isChecked = item.isMain || selectedBundleIds.includes(item.id);
                return (
                  <React.Fragment key={item.id}>
                    <div 
                      onClick={() => !item.isMain && handleToggleBundleCompanion(item.id)}
                      style={{
                        minWidth: 100,
                        maxWidth: 110,
                        background: isChecked ? '#ffffff' : '#f8fafc',
                        border: isChecked ? '2px solid var(--primary)' : '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '8px',
                        position: 'relative',
                        cursor: item.isMain ? 'default' : 'pointer',
                        opacity: isChecked ? 1 : 0.6,
                        boxShadow: isChecked ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Checkbox indicator */}
                      <div style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        width: 18,
                        height: 18,
                        borderRadius: '4px',
                        background: isChecked ? 'var(--primary)' : '#ffffff',
                        border: isChecked ? 'none' : '1.5px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 'bold',
                        zIndex: 2
                      }}>
                        {isChecked ? '✓' : ''}
                      </div>

                      {item.isMain && (
                        <span style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          fontSize: 9,
                          fontWeight: 800,
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '1px 5px',
                          borderRadius: '4px'
                        }}>
                          This item
                        </span>
                      )}

                      <div style={{
                        width: '100%',
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 14,
                        marginBottom: 6
                      }}>
                        {item.image ? (
                          <img
                            src={optimizeImageUrl(item.image, 140)}
                            alt={item.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#94a3b8' }}>
                            shopping_bag
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 2
                      }}>
                        {item.name}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>
                          ₹{item.price}
                        </span>
                        <span style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'line-through' }}>
                          ₹{item.originalPrice}
                        </span>
                      </div>
                    </div>

                    {index < bundleItems.length - 1 && (
                      <span style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: '#94a3b8',
                        padding: '0 2px'
                      }}>
                        +
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bundle Total & Add Button */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  Total for {activeBundleItems.length} items:
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                    ₹{bundleTotalPrice}
                  </span>
                  {bundleTotalOriginal > bundleTotalPrice && (
                    <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                      ₹{bundleTotalOriginal}
                    </span>
                  )}
                </div>
                {bundleSavings > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
                    Save ₹{bundleSavings} with this bundle
                  </div>
                )}
              </div>

              <button
                onClick={handleAddBundleToCart}
                style={{
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(45, 138, 78, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_shopping_cart</span>
                Add Bundle
              </button>
            </div>
          </div>
        )}

        {/* Product Details & Specifications Tabbed Section */}
        <div style={{ background: '#ffffff', padding: '16px', marginTop: 8, borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
            Product Information & Specs
          </h3>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1.5px solid #e2e8f0',
            marginBottom: 14,
            gap: 16
          }}>
            {[
              { id: 'highlights', label: 'Highlights' },
              { id: 'specs', label: 'Specifications' },
              { id: 'nutrition', label: 'Nutrition & Care' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 4px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: activeTab === tab.id ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : '#64748b',
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'highlights' && (
            <div>
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 12px' }}>
                {product.description || `Premium quality ${product.name} sourced fresh directly from certified regional suppliers in and around Gujarat.`}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  '100% Inspected & Authentic Quality Guarantee',
                  'Hygienically packaged with safe tamper-evident seal',
                  'Brand warranty / manufacturer guarantee supported',
                  'Express dispatch directly from Botanís warehouse'
                ].map((highlight, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#1e293b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16a34a' }}>check_circle</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Category', value: product.category.replace('_', ' ').toUpperCase() },
                { label: 'Standard Pack', value: hasVariants ? selectedSize : product.unit },
                { label: 'Item Condition', value: 'Brand New (100% Original)' },
                { label: 'Country of Origin', value: 'India' },
                { label: 'Store Location', value: 'Botanís Central Hub, Gujarat' },
                { label: 'Quality Verification', value: '100% Quality Inspected' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                  borderRadius: '6px',
                  fontSize: 12.5
                }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: 12,
                fontSize: 12,
                color: '#166534'
              }}>
                💡 <strong>Care & Usage:</strong> Refer to user manual and packaging for optimal performance and safety instructions.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { title: 'Warranty', val: '1 Year Brand' },
                  { title: 'Voltage / Power', val: '230V AC / 50Hz' },
                  { title: 'Material / Body', val: 'Heavy Duty Grade' },
                  { title: 'Customer Support', val: '24/7 Botanís Support' }
                ].map((nutri, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{nutri.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{nutri.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Flipkart / Amazon Trust Guarantee Icons */}
        <div style={{
          background: '#ffffff',
          padding: '16px',
          marginTop: 8,
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            textAlign: 'center'
          }}>
            {[
              { icon: 'verified_user', title: '100% Genuine', sub: 'Quality Inspected' },
              { icon: 'electric_bolt', title: '15-Min Speed', sub: 'Hyper-Local' },
              { icon: 'published_with_changes', title: 'Doorstep Return', sub: 'Instant Refund' },
              { icon: 'payments', title: 'Cash on Delivery', sub: 'UPI / Cards' }
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{feature.icon}</span>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{feature.title}</div>
                <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>{feature.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div style={{
            background: '#ffffff',
            padding: '16px',
            marginTop: 8,
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Similar Items in {product.category.replace('_', ' ')}
              </h3>
              <span 
                onClick={() => navigate(`/category/${product.category}`)}
                style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }}
              >
                View All →
              </span>
            </div>

            <div className="no-scrollbar" style={{
              display: 'flex',
              overflowX: 'auto',
              gap: 12,
              paddingBottom: 4
            }}>
              {relatedProducts.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    minWidth: 135,
                    maxWidth: 135,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: 8,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.image ? (
                      <img 
                        src={optimizeImageUrl(item.image, 200)} 
                        alt={item.name} 
                        loading="lazy"
                        style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                      />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#94a3b8' }}>
                        shopping_bag
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    ₹{item.price} / {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 Flipkart / Amazon Style Sticky Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        padding: '10px 16px',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        zIndex: 'var(--z-nav)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {qty > 0 ? (
          <>
            {/* Quantity Stepper */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              height: 48,
              width: 120,
              border: '1px solid #cbd5e1'
            }}>
              <button
                onClick={() => decrement(itemKey)}
                style={{
                  width: 36, height: 36, borderRadius: '8px',
                  background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0f172a', border: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontWeight: 'bold' }}>remove</span>
              </button>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                {qty}
              </span>
              <button
                onClick={() => increment(itemKey)}
                style={{
                  width: 36, height: 36, borderRadius: '8px',
                  background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontWeight: 'bold' }}>add</span>
              </button>
            </div>

            {/* View Cart / Checkout button */}
            <button
              onClick={() => navigate('/cart')}
              style={{
                flex: 1,
                height: 48,
                background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 800,
                fontSize: 14.5,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart_checkout</span>
              <span>View Cart (₹{currentPrice * qty})</span>
            </button>
          </>
        ) : (
          <>
            {/* Add To Cart (Secondary) */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.available}
              style={{
                flex: 1,
                height: 48,
                background: '#ffffff',
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: 14,
                cursor: product.available ? 'pointer' : 'not-allowed',
                opacity: product.available ? 1 : 0.6,
                transition: 'all 0.15s ease'
              }}
            >
              {adding ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_shopping_cart</span>
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy Now (Primary Amazon/Flipkart Orange/Green) */}
            <button
              onClick={handleBuyNow}
              disabled={!product.available}
              style={{
                flex: 1,
                height: 48,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: 14,
                cursor: product.available ? 'pointer' : 'not-allowed',
                opacity: product.available ? 1 : 0.6,
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>bolt</span>
              <span>Buy Now</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
