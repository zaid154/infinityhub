import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts & Structural Guards (Eager for instant shell rendering)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';
import PageLoader from './components/PageLoader';

// Eager Primary Page (Immediate initial viewport render)
import Home from './pages/Home';

// Lazy Loaded Secondary Public Pages
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const RentalPlans = lazy(() => import('./pages/RentalPlans'));
const Buyback = lazy(() => import('./pages/Buyback'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy Loaded Statutory Legal & Policy Pages (12 Dedicated Modules)
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/legal/TermsConditionsPage'));
const RentalSLAPage = lazy(() => import('./pages/legal/RentalSLAPage'));
const RefundCancellationPage = lazy(() => import('./pages/legal/RefundCancellationPage'));
const WarrantyPolicyPage = lazy(() => import('./pages/legal/WarrantyPolicyPage'));
const ShippingPolicyPage = lazy(() => import('./pages/legal/ShippingPolicyPage'));
const HardwareReplacementPage = lazy(() => import('./pages/legal/HardwareReplacementPage'));
const CookiePolicyPage = lazy(() => import('./pages/legal/CookiePolicyPage'));
const DisclaimerPage = lazy(() => import('./pages/legal/DisclaimerPage'));
const RefurbishedDisclosurePage = lazy(() => import('./pages/legal/RefurbishedDisclosurePage'));
const EWastePolicyPage = lazy(() => import('./pages/legal/EWastePolicyPage'));
const GrievanceRedressalPage = lazy(() => import('./pages/legal/GrievanceRedressalPage'));

// Lazy Loaded Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Lazy Loaded Customer Dashboard Pages
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const MyRentals = lazy(() => import('./pages/MyRentals'));
const MyProfile = lazy(() => import('./pages/MyProfile'));

// Lazy Loaded Admin Dashboard Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminDemand = lazy(() => import('./pages/admin/AdminDemand'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminRentals = lazy(() => import('./pages/admin/AdminRentals'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminBuyback = lazy(() => import('./pages/admin/AdminBuyback'));
const AdminDeliveryZones = lazy(() => import('./pages/admin/AdminDeliveryZones'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              gutter={8}
              containerStyle={{
                top: 72,
                right: 12
              }}
              toastOptions={{
                duration: 2800,
                style: {
                  background: '#0A261B',
                  color: '#FAF7F2',
                  border: '1px solid rgba(212, 162, 76, 0.35)',
                  boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.45)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: '500',
                  lineHeight: '1.35',
                  maxWidth: 'calc(100vw - 24px)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                },
                success: {
                  iconTheme: {
                    primary: '#D4A24C',
                    secondary: '#072117'
                  },
                  style: {
                    background: '#0A261B',
                    color: '#FAF7F2',
                    border: '1px solid #D4A24C'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FAF7F2'
                  },
                  style: {
                    background: '#1A0E0E',
                    color: '#FAF7F2',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    maxWidth: '310px'
                  }
                }
              }}
            />

            <Suspense fallback={<PageLoader />}>
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
                  <Route path="demand" element={<AdminDemand />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="rentals" element={<AdminRentals />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="buyback" element={<AdminBuyback />} />
                  <Route path="delivery-zones" element={<AdminDeliveryZones />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
