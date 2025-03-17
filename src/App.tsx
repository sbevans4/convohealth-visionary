
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Eagerly load critical components
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import MainLayout from '@/layouts/MainLayout';
import NotFound from '@/pages/NotFound';

// Lazy load non-critical pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const VoiceRecording = lazy(() => import('@/pages/VoiceRecording'));
const ImageAnalysis = lazy(() => import('@/pages/ImageAnalysis'));
const Subscription = lazy(() => import('@/pages/Subscription'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const HipaaCompliance = lazy(() => import('@/pages/HipaaCompliance'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/recording" element={
            <Suspense fallback={<PageLoader />}>
              <VoiceRecording />
            </Suspense>
          } />
          <Route path="/image-analysis" element={
            <Suspense fallback={<PageLoader />}>
              <ImageAnalysis />
            </Suspense>
          } />
          <Route path="/subscription" element={
            <Suspense fallback={<PageLoader />}>
              <Subscription />
            </Suspense>
          } />
          <Route path="/privacy-policy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/hipaa" element={
            <Suspense fallback={<PageLoader />}>
              <HipaaCompliance />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfService />
            </Suspense>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
