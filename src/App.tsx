
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
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
          
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="voice-recording" element={<VoiceRecording />} />
            <Route path="image-analysis" element={<ImageAnalysis />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="about" element={<About />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
