import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { PublicHeader } from './ui/components/Header';
import Footer from './ui/components/Footer';
import ProtectedRoute from './ui/components/ProtectedRoute';
import DynamicSkinRenderer from './engine/DynamicSkinRenderer';

// ─── User-facing pages ────────────────────────────────────────────────────────
import HomePage from './ui/pages/Home';
import ProductListingPage from './ui/pages/ProductListingPage';
import ProductDetailPage from './ui/pages/ProductDetailPage';
import CartPage from './ui/pages/CartPage';
import CheckoutPage from './ui/pages/CheckoutPage';
import AboutPage from './ui/pages/AboutPage';
import ContactPage from './ui/pages/ContactPage';
import SignInPage from './ui/pages/SignInPage';
import ProfilePage from './ui/pages/ProfilePage';

// ─── Admin pages (store-scoped) ───────────────────────────────────────────────
import AdminPage from './ui/admin/AdminPage';
import AdminOrdersPage from './ui/admin/AdminOrdersPage';
import AdminProductsPage from './ui/admin/AdminProductsPage';
import AdminAddProductPage from './ui/admin/AdminAddProductPage';
import AdminEditProductPage from './ui/admin/AdminEditProductPage';
import AdminUsersPage from './ui/admin/AdminUsersPage';
import AdminBrandsPage from './ui/admin/AdminBrandsPage';
import AdminCategoriesPage from './ui/admin/AdminCategoriesPage';
import AdminCouponsPage from './ui/admin/AdminCouponsPage';
import AdminBannersPage from './ui/admin/AdminBannersPage';
import AdminAnnouncementsPage from './ui/admin/AdminAnnouncementsPage';

// ─── Playground & Super Admin (lazy-loaded) ───────────────────────────────────
import { lazy, Suspense } from 'react';
const SkinPlayground = lazy(() => import('./ui/playground/SkinPlayground'));
const SuperAdminPanel = lazy(() => import('./ui/super-admin/SuperAdminPanel'));

// Routes where the public Header/Footer are hidden
const NO_CHROME_PREFIXES = ['/admin', '/playground', '/super-admin'];

const FullscreenLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0f0f0f',
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '3px solid #333', borderTop: '3px solid #764ba2',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function AppLayout() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) return <FullscreenLoader />;

  const hideChrome = NO_CHROME_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <DynamicSkinRenderer skinKey="Header.jsx" FallbackComponent={PublicHeader} />}
      <main className="flex-1">
        <Routes>
          {/* ── Public storefront routes ──────────────────────────────────── */}
          <Route path="/" element={<DynamicSkinRenderer skinKey="Home.jsx" FallbackComponent={HomePage} />} />
          <Route path="/products" element={<DynamicSkinRenderer skinKey="ProductListingPage.jsx" FallbackComponent={ProductListingPage} />} />
          <Route path="/product/:id" element={<DynamicSkinRenderer skinKey="ProductDetailPage.jsx" FallbackComponent={ProductDetailPage} />} />
          <Route path="/cart" element={<DynamicSkinRenderer skinKey="CartPage.jsx" FallbackComponent={CartPage} />} />
          <Route path="/checkout" element={<DynamicSkinRenderer skinKey="CheckoutPage.jsx" FallbackComponent={CheckoutPage} />} />
          <Route path="/about" element={<DynamicSkinRenderer skinKey="AboutPage.jsx" FallbackComponent={AboutPage} />} />
          <Route path="/contact" element={<DynamicSkinRenderer skinKey="ContactPage.jsx" FallbackComponent={ContactPage} />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<DynamicSkinRenderer skinKey="ProfilePage.jsx" FallbackComponent={ProfilePage} />} />

          {/* ── Skin Playground (publicly accessible) ───────────────────────── */}
          <Route
            path="/playground"
            element={
              <Suspense fallback={<FullscreenLoader />}>
                <SkinPlayground />
              </Suspense>
            }
          />

          {/* ── Store Admin Panel (store owner only) ──────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="store_owner">
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<div />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/add" element={<AdminAddProductPage />} />
            <Route path="products/edit/:id" element={<AdminEditProductPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
          </Route>

          {/* ── SaaS Super Admin (platform owner only) ───────────────────── */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute role="super_admin">
                <Suspense fallback={<FullscreenLoader />}>
                  <SuperAdminPanel />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!hideChrome && <DynamicSkinRenderer skinKey="Footer.jsx" FallbackComponent={Footer} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/*
        ┌──────────────────────────────────────────────────────────┐
        │  Provider nesting order (outermost → innermost):         │
        │  StoreProvider — resolves domain → storeId FIRST         │
        │  AuthProvider  — storeId-aware authentication            │
        │  CartProvider  — storeId-keyed cart                      │
        │  AppLayout     — routing + page rendering                 │
        └──────────────────────────────────────────────────────────┘
      */}
      <StoreProvider>
        <AuthProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
