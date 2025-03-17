
import React, { useState, Suspense, lazy } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTutorial } from '@/hooks/useTutorial';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the tutorial component
const TutorialOverlay = lazy(() => import('@/components/tutorial/TutorialOverlay'));

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { showTutorial, setShowTutorial } = useTutorial();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          
          <footer className="border-t py-4 px-6 text-sm text-muted-foreground">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <div>
                &copy; {new Date().getFullYear()} MediScribe AI. All rights reserved.
              </div>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
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
