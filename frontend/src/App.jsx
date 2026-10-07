import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import WhatsAppFloat from './components/WhatsAppFloat';

import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import About from './pages/About';
import Offers from './pages/Offers';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import SettingsManager from './pages/admin/SettingsManager';

function AdminRoute({ children }) {
  const admin = localStorage.getItem('bandamart_admin');
  if (!admin) return <Navigate to="/admin" replace />;
  try {
    const data = JSON.parse(admin);
    if (!data.loggedIn) return <Navigate to="/admin" replace />;
  } catch {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/category/:categoryId" element={<ProductListing />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/offers" element={<Offers />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute><ProductManager /></AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute><CategoryManager /></AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute><SettingsManager /></AdminRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <WhatsAppFloat />
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}
