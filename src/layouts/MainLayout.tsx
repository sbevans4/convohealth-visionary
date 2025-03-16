
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
