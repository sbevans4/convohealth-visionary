import React, { useState, Suspense, lazy, Component, ReactNode, ErrorInfo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTutorial } from '@/hooks/useTutorial';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the tutorial component
const TutorialOverlay = lazy(() => import('@/components/tutorial/TutorialOverlay'));

// Error Fallback component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <Alert variant="destructive" className="max-w-xl">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg">Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message || "An unexpected error occurred while loading this page."}</p>
          <Button 
            variant="outline" 
            onClick={resetErrorBoundary}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

// ErrorBoundary class component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, resetErrorBoundary: () => void) => React.ReactNode;
  resetKeys?: Array<any>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.props.resetKeys && 
        prevProps.resetKeys !== this.props.resetKeys) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(
        this.state.error,
        () => this.setState({ hasError: false, error: null })
      );
    }

    return this.props.children;
  }
}

// Loading component
const PageLoader = () => (
  <div className="flex flex-col gap-4 p-6">
    <Skeleton className="h-8 w-[250px] mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[120px] rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-[300px] mt-4 rounded-lg" />
  </div>
);

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { showTutorial, setShowTutorial } = useTutorial();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Close sidebar on mobile by default
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Show loading state on page navigation
  React.useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full bg-background">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Add padding top for mobile app bar */}
        <div className={`flex flex-col flex-1 overflow-y-auto w-full ${isMobile ? 'pt-14' : ''}`}>
          <main className="flex-1 transition-all">
            <ErrorBoundaryComponent
              fallback={(error, resetErrorBoundary) => (
                <ErrorFallback 
                  error={error} 
                  resetErrorBoundary={() => {
                    resetErrorBoundary();
                    setIsPageLoading(false);
                  }}
                />
              )}
              resetKeys={[location.pathname]}
            >
              {isPageLoading ? (
                <PageLoader />
              ) : (
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              )}
            </ErrorBoundaryComponent>
          </main>
          
          <footer className="border-t py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm text-muted-foreground">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <div>
                &copy; {new Date().getFullYear()} MediScribe AI. All rights reserved.
              </div>
              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0 flex-wrap justify-center">
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
                <Link to="/hipaa" className="hover:underline">
                  HIPAA Compliance
                </Link>
                <Link to="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Lazy load the tutorial overlay */}
      <Suspense fallback={null}>
        <TutorialOverlay 
          open={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
      </Suspense>
    </SidebarProvider>
  );
};

export default MainLayout;
