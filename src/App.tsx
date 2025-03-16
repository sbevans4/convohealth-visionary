
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import VoiceRecording from '@/pages/VoiceRecording';
import ImageAnalysis from '@/pages/ImageAnalysis';
import Subscription from '@/pages/Subscription';
import NotFound from '@/pages/NotFound';
import MainLayout from '@/layouts/MainLayout';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import HipaaCompliance from '@/pages/HipaaCompliance';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recording" element={<VoiceRecording />} />
          <Route path="/image-analysis" element={<ImageAnalysis />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/hipaa" element={<HipaaCompliance />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
