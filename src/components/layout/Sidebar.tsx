import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Mic, Image, CreditCard, Menu, X } from 'lucide-react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Voice Recording", icon: Mic, path: "/voice-recording" },
    { title: "Image Analysis", icon: Image, path: "/image-analysis" },
    { title: "Subscription", icon: CreditCard, path: "/subscription" },
  ];

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile App Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b flex items-center justify-between px-4 h-14">
          <h2 className="text-lg font-semibold">AI Doctor Notes</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <DrawerContent className="top-14 h-[calc(100vh-56px)] rounded-none">
            <div className="p-4 h-full flex flex-col">
              <SidebarMenu className="space-y-3 flex-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleMenuItemClick(item.path)}
                      className="w-full"
                    >
                      <div className="flex items-center gap-3 p-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={`fixed inset-y-0 z-40 transition-transform transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-auto lg:z-auto`}
    >
      <ShadcnSidebar className="h-full">
        <SidebarContent className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-xl font-bold">AI Doctor Notes</h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-200"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarMenu className="space-y-3 p-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleMenuItemClick(item.path)}
                    tooltip={item.title}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className="hidden lg:block">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>
      </ShadcnSidebar>
    </div>
  );
};

export default Sidebar;