
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mic, Image, CreditCard, Menu } from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/dashboard" },
    { title: "Voice Recording", icon: Mic, path: "/recording" },
    { title: "Image Analysis", icon: Image, path: "/image-analysis" },
    { title: "Subscription", icon: CreditCard, path: "/subscription" },
  ];

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">AI Doctor Notes</h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
          >
            <Menu size={20} />
          </button>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
