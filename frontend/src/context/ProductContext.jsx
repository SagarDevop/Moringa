import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOTANIS_PRODUCTS } from '../data/botanisProducts';

const ProductContext = createContext();

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(BOTANIS_PRODUCTS);
  const [whatsappNumber, setWhatsappNumber] = useState('917016371119');

  useEffect(() => {
    // Background fetch to check for backend updates if available
    fetch(`${API_BASE}/products`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Fallback silently to static Botanís products
      });

    fetch(`${API_BASE}/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(settings => {
        if (settings && settings.whatsapp_number) {
          setWhatsappNumber(settings.whatsapp_number);
        }
      })
      .catch(() => {});
  }, []);

  const getProduct = (id) => 
    products.find(p => p.id === id) || BOTANIS_PRODUCTS.find(p => p.id === id);

  const getFeaturedProducts = () => products.filter(p => p.featured && p.available);

  const searchProducts = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(p =>
      p.available !== false && (
        p.name.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    );
  };

  return (
    <ProductContext.Provider value={{
      products,
      whatsappNumber,
      getProduct,
      getFeaturedProducts,
      searchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
