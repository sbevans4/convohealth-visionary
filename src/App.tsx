import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import VoiceRecording from './pages/VoiceRecording';
import ImageAnalysis from './pages/ImageAnalysis';
import Subscription from './pages/Subscription';
import MedicalDocumentation from './pages/MedicalDocumentation';
import ViewNote from './pages/ViewNote';
import Index from './pages/Index';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import About from './pages/About';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HipaaCompliance from './pages/HipaaCompliance';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';


import { initializeCleanupScheduler } from "@/hooks/recording/cleanupScheduler";
import { initMobileApp } from './utils/mobileAdapter';
import { isPlatform } from './utils/platformUtils';

// Initialize cleanup scheduler
initializeCleanupScheduler();

// Query client setup
const queryClient = new QueryClient();

// Wrapped App with back button support
function AppWrapper() {
  const location = useLocation();

useEffect(() => {
  let backHandler: PluginListenerHandle;

  const setupBackHandler = async () => {
    backHandler = await CapacitorApp.addListener('backButton', () => {
      const exitRoutes = ['/', '/landing', '/dashboard', '/auth'];
      if (exitRoutes.includes(location.pathname)) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  };

  setupBackHandler();

  return () => {
    backHandler?.remove();
  };
}, [location]);


  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/hipaa" element={<HipaaCompliance />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="voice-recording" element={<VoiceRecording />} />
          <Route path="image-analysis" element={<ImageAnalysis />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="about" element={<About />} />
          <Route path="medical-documentation" element={<MedicalDocumentation />} />
          <Route path="medical-documentation/:id" element={<ViewNote />} />
          <Route path="view-note/:id" element={<ViewNote />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Final export
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppWrapper />
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
