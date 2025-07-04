import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegistrationPage = lazy(() => import('@/pages/RegistrationPage'));
const TouristPlacesPage = lazy(() => import('@/pages/TouristPlacesPage'));
const TouristPlaceDetailPage = lazy(() => import('@/pages/TouristPlaceDetailPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const BookingsListPage = lazy(() => import('@/pages/BookingsListPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const PinLockPage = lazy(() => import('@/pages/PinLockPage'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-background">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-20 h-20 border-8 border-primary border-t-transparent rounded-full"
    />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  return !user ? children : <Navigate to="/" replace />;
};

function AppContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegistrationPage /></PublicRoute>} />
          <Route path="/places" element={<TouristPlacesPage />} />
          <Route path="/places/:id" element={<TouristPlaceDetailPage />} />
          <Route path="/booking/:placeId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsListPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<ResetPasswordPage />} />
          <Route path="/pinlock" element={<PinLockPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;