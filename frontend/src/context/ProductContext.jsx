import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOTANIS_PRODUCTS } from '../data/botanisProducts';

const ProductContext = createContext();

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('917016371119');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCatalog() {
      // 1. Try to load from localStorage cache first
      let cachedProds = null;
      let cachedCats = null;
      let cachedWhatsapp = '917016371119';
      try {
        const p = localStorage.getItem('bandamart_cache_products');
        const c = localStorage.getItem('bandamart_cache_categories');
        const w = localStorage.getItem('bandamart_cache_whatsapp');
        if (p && c) {
          cachedProds = JSON.parse(p);
          cachedCats = JSON.parse(c);
        }
        if (w) {
          cachedWhatsapp = w;
        }
      } catch (e) {
        console.warn('Failed to read localStorage cache:', e);
      }

      // If we have cached data, render it immediately and hide the loader
      if (cachedProds && cachedCats && cachedProds.length > 0 && cachedCats.length > 0) {
        setProducts(cachedProds);
        setCategories(cachedCats);
        setWhatsappNumber(cachedWhatsapp);
        setLoading(false);
      }

      // 2. Revalidate in the background
      try {
        const [resProd, resCat, resSettings] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/settings`).catch(err => {
            console.warn('Failed to fetch settings from backend:', err);
            return { ok: false };
          })
        ]);
        if (resProd.ok && resCat.ok) {
          let prods = await resProd.json();
          let cats = await resCat.json();
          let whatsapp = '917016371119';
          if (resSettings && resSettings.ok) {
            const settings = await resSettings.json();
            if (settings.whatsapp_number) {
              whatsapp = settings.whatsapp_number;
            }
          }

          // Compare with cached data to avoid state updates and re-renders if nothing changed
          const prodsStr = JSON.stringify(prods);
          const catsStr = JSON.stringify(cats);
          const cachedProdsStr = cachedProds ? JSON.stringify(cachedProds) : '';
          const cachedCatsStr = cachedCats ? JSON.stringify(cachedCats) : '';

          if (prodsStr !== cachedProdsStr || catsStr !== cachedCatsStr || whatsapp !== cachedWhatsapp) {
            setProducts(prods);
            setCategories(cats);
            setWhatsappNumber(whatsapp);
            
            // Save to cache
            localStorage.setItem('bandamart_cache_products', prodsStr);
            localStorage.setItem('bandamart_cache_categories', catsStr);
            localStorage.setItem('bandamart_cache_whatsapp', whatsapp);
          }
        } else {
          throw new Error('API returned invalid status');
        }
      } catch (err) {
        console.error('Failed to fetch catalog from backend:', err);
        // Only load blank arrays if we don't have any cached data at all
        if (!cachedProds || !cachedCats) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    initCatalog();
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const newProd = await res.json();
        setProducts(prev => {
          const updated = [newProd, ...prev];
          localStorage.setItem('bandamart_cache_products', JSON.stringify(updated));
          return updated;
        });
        return newProd;
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => {
          const newProds = prev.map(p => p.id === id ? updated : p);
          localStorage.setItem('bandamart_cache_products', JSON.stringify(newProds));
          return newProds;
        });
        return updated;
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => {
          const newProds = prev.filter(p => p.id !== id);
          localStorage.setItem('bandamart_cache_products', JSON.stringify(newProds));
          return newProds;
        });
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const getProduct = (id) => 
    products.find(p => p.id === id) || BOTANIS_PRODUCTS.find(p => p.id === id);

  const getProductsByCategory = (categoryId) =>
    products.filter(p => p.category === categoryId && p.available);

  const getFeaturedProducts = () => products.filter(p => p.featured && p.available);

  const searchProducts = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const allProds = [...products, ...BOTANIS_PRODUCTS];
    return allProds.filter(p =>
      p.available && (
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    );
  };

  const addCategory = async (category) => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories(prev => {
          const updated = [...prev, newCat];
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(updated));
          return updated;
        });
        return newCat;
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(prev => {
          const newCats = prev.map(c => c.id === id ? updated : c);
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(newCats));
          return newCats;
        });
        return updated;
      }
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(prev => {
          const newCats = prev.filter(c => c.id !== id);
          localStorage.setItem('bandamart_cache_categories', JSON.stringify(newCats));
          return newCats;
        });
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const getCategory = (id) => categories.find(c => c.id === id);

  const getCategoryProductCount = (categoryId) =>
    products.filter(p => p.category === categoryId).length;

  const updateWhatsappNumber = async (number) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'whatsapp_number', value: number }),
      });
      if (res.ok) {
        const updated = await res.json();
        const cleanVal = updated.value;
        setWhatsappNumber(cleanVal);
        localStorage.setItem('bandamart_cache_whatsapp', cleanVal);
        return cleanVal;
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update WhatsApp number');
      }
    } catch (err) {
      console.error('Error updating WhatsApp number:', err);
      throw err;
    }
  };

  if (loading) {
    return <CatalogSplash />;
  }

  return (
    <ProductContext.Provider value={{
      products, categories, loading, whatsappNumber, updateWhatsappNumber,
      addProduct, updateProduct, deleteProduct, getProduct,
      getProductsByCategory, getFeaturedProducts, searchProducts,
      addCategory, updateCategory, deleteCategory, getCategory,
      getCategoryProductCount
    }}>
      {children}
    </ProductContext.Provider>
  );
}

function CatalogSplash() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      background: '#F8F6F0',
      color: '#1C3B2B',
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '32px',
      }}>
        {/* Botanis Brand Icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '24px',
          background: '#1C3B2B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
          boxShadow: '0 8px 20px rgba(28, 59, 43, 0.15)'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#EAF2E8' }}>
            eco
          </span>
        </div>

        <h1 style={{
          margin: 0,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: '-0.02em',
          color: '#1C3B2B',
          fontFamily: "'Playfair Display', Georgia, serif"
        }}>
          Botanís
        </h1>
        <p style={{ color: '#2E7D32', margin: 0, fontSize: 13, fontWeight: 600, fontStyle: 'italic' }}>
          Your Trusted Path to Healthy Living
        </p>

        {/* Premium CSS-only rotating spinner */}
        <div className="animate-spin" style={{
          width: 28,
          height: 28,
          border: '3px solid #EAE6DC',
          borderTop: '3px solid #1C3B2B',
          borderRadius: '50%',
          marginTop: '24px',
          display: 'inline-block',
          boxSizing: 'border-box',
        }} />

        <p style={{
          color: '#667085',
          marginTop: '32px',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600
        }}>
          100% Pure Organic Natural Wellness
        </p>
      </div>
    </div>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
