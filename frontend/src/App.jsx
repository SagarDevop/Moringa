import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import WhatsAppFloat from './components/WhatsAppFloat';
import SwipeNavigationWrapper from './components/SwipeNavigationWrapper';

// Home page loaded statically for instant above-the-fold render
import Home from './pages/Home';

// Customer secondary routes loaded lazily for minimal initial bundle
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Search = lazy(() => import('./pages/Search'));
const About = lazy(() => import('./pages/About'));
const Offers = lazy(() => import('./pages/Offers'));

export default function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <SwipeNavigationWrapper>
            <Suspense fallback={null}>
              <Routes>
                {/* Customer Routes Only */}
                <Route path="/" element={<Home />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/search" element={<Search />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <WhatsAppFloat />
          </SwipeNavigationWrapper>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

