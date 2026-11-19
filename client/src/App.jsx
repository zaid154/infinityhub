import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Protection Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import RentalPlans from './pages/RentalPlans';
import Buyback from './pages/Buyback';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

// Statutory Legal & Policy Pages (12 Dedicated Modules)
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsConditionsPage from './pages/legal/TermsConditionsPage';
import RentalSLAPage from './pages/legal/RentalSLAPage';
import RefundCancellationPage from './pages/legal/RefundCancellationPage';
import WarrantyPolicyPage from './pages/legal/WarrantyPolicyPage';
import ShippingPolicyPage from './pages/legal/ShippingPolicyPage';
import HardwareReplacementPage from './pages/legal/HardwareReplacementPage';
import CookiePolicyPage from './pages/legal/CookiePolicyPage';
import DisclaimerPage from './pages/legal/DisclaimerPage';
import RefurbishedDisclosurePage from './pages/legal/RefurbishedDisclosurePage';
import EWastePolicyPage from './pages/legal/EWastePolicyPage';
import GrievanceRedressalPage from './pages/legal/GrievanceRedressalPage';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Customer Dashboard Pages
import CustomerDashboard from './pages/CustomerDashboard';
import MyOrders from './pages/MyOrders';
import MyRentals from './pages/MyRentals';
import MyProfile from './pages/MyProfile';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRentals from './pages/admin/AdminRentals';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminBuyback from './pages/admin/AdminBuyback';
import AdminDeliveryZones from './pages/admin/AdminDeliveryZones';
import AdminSettings from './pages/admin/AdminSettings';

// Global Scroll Restoration
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0D3B2A',
                color: '#FAF7F2',
                border: '1.5px solid rgba(212, 162, 76, 0.45)',
                boxShadow: '0 16px 36px rgba(13, 59, 42, 0.3), 0 4px 12px rgba(0, 0, 0, 0.12)',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '12.5px',
                fontWeight: '600',
                letterSpacing: '0.01em',
                maxWidth: '420px',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              },
              success: {
                iconTheme: {
                  primary: '#D4A24C',
                  secondary: '#0D3B2A'
                },
                style: {
                  background: '#0D3B2A',
                  color: '#FAF7F2',
                  border: '1.5px solid #D4A24C'
                }
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FAF7F2'
                },
                style: {
                  background: '#1F1414',
                  color: '#FAF7F2',
                  border: '1.5px solid rgba(239, 68, 68, 0.5)'
                }
              }
            }}
          />

          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:slug" element={<ProductDetail />} />
              <Route path="rental" element={<RentalPlans />} />
              <Route path="buyback" element={<Buyback />} />
              <Route path="liquidation" element={<Navigate to="/buyback" replace />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cart" element={<Cart />} />
              
              {/* Master Legal Index & 12 Statutory Policy Pages */}
              <Route path="legal" element={<Legal />} />
              <Route path="terms" element={<TermsConditionsPage />} />
              <Route path="terms-and-conditions" element={<Navigate to="/terms" replace />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="privacy-policy" element={<Navigate to="/privacy" replace />} />
              <Route path="rental-sla" element={<RentalSLAPage />} />
              <Route path="refund-policy" element={<RefundCancellationPage />} />
              <Route path="refund" element={<Navigate to="/refund-policy" replace />} />
              <Route path="warranty-policy" element={<WarrantyPolicyPage />} />
              <Route path="warranty" element={<Navigate to="/warranty-policy" replace />} />
              <Route path="shipping-policy" element={<ShippingPolicyPage />} />
              <Route path="shipping" element={<Navigate to="/shipping-policy" replace />} />
              <Route path="replacement-policy" element={<HardwareReplacementPage />} />
              <Route path="replacement" element={<Navigate to="/replacement-policy" replace />} />
              <Route path="cookie-policy" element={<CookiePolicyPage />} />
              <Route path="cookies" element={<Navigate to="/cookie-policy" replace />} />
              <Route path="disclaimer" element={<DisclaimerPage />} />
              <Route path="refurbished-disclosure" element={<RefurbishedDisclosurePage />} />
              <Route path="refurbished" element={<Navigate to="/refurbished-disclosure" replace />} />
              <Route path="ewaste-policy" element={<EWastePolicyPage />} />
              <Route path="ewaste" element={<Navigate to="/ewaste-policy" replace />} />
              <Route path="grievance" element={<GrievanceRedressalPage />} />
              <Route path="data-deletion" element={<Navigate to="/grievance" replace />} />

              {/* Auth Routes */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="verify-email/:token" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />

              {/* Customer Dashboard (Protected) */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/rentals"
                element={
                  <ProtectedRoute>
                    <MyRentals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback within Public MainLayout */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Portal (Admin Only Protected) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="rentals" element={<AdminRentals />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="buyback" element={<AdminBuyback />} />
              <Route path="delivery-zones" element={<AdminDeliveryZones />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
