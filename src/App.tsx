
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VoiceRecording = lazy(() => import("./pages/VoiceRecording"));
const ImageAnalysis = lazy(() => import("./pages/ImageAnalysis"));
const Subscription = lazy(() => import("./pages/Subscription"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={
          <Suspense fallback={<LoadingScreen />}>
            <Auth />
          </Suspense>
        } />
        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingScreen />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/medical-documentation" element={
            <Suspense fallback={<LoadingScreen />}>
              <VoiceRecording />
            </Suspense>
          } />
          <Route path="/medical-documentation/image" element={
            <Suspense fallback={<LoadingScreen />}>
              <ImageAnalysis />
            </Suspense>
          } />
          <Route path="/subscription-plans" element={
            <Suspense fallback={<LoadingScreen />}>
              <Subscription />
            </Suspense>
          } />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-medical-200 border-t-medical-600 animate-spin"></div>
      <p className="text-muted-foreground animate-pulse-soft">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
