
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import VoiceRecording from './pages/VoiceRecording';
import ImageAnalysis from './pages/ImageAnalysis';
import Subscription from './pages/Subscription';
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

import { initializeCleanupScheduler } from "@/hooks/recording/cleanupScheduler";
import { initMobileApp } from './utils/mobileAdapter';
import { isPlatform } from './utils/platformUtils';

// Initialize the cleanup scheduler at app startup
initializeCleanupScheduler();

function App() {
  // Initialize mobile adaptations on app start
  useEffect(() => {
    if (isPlatform('android') || isPlatform('ios')) {
      initMobileApp().catch(error => {
        console.error('Failed to initialize mobile app:', error);
      });
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
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
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
