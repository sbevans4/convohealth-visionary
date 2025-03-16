
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Mic, 
  Image, 
  Home, 
  CreditCard, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const sidebarItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    { 
      icon: Mic, 
      label: "Voice Recording", 
      path: "/medical-documentation",
      active: location.pathname === "/medical-documentation"
    },
    { 
      icon: Image, 
      label: "Image Analysis", 
      path: "/medical-documentation/image",
      active: location.pathname === "/medical-documentation/image"
    },
    { 
      icon: CreditCard, 
      label: "Subscriptions", 
      path: "/subscription-plans",
      active: location.pathname === "/subscription-plans"
    },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 }
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="h-16 md:hidden flex items-center justify-between px-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-medical-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">CN</span>
          </div>
          <span className="font-semibold text-lg">ConvoNotes</span>
        </Link>
        
        <div className="w-10"></div> {/* Placeholder for balance */}
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Container with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop Always Visible, Mobile Animated */}
        <AnimatePresence>
          <motion.aside
            className={cn(
              "fixed md:relative top-0 bottom-0 left-0 z-50 md:z-auto",
              "w-72 bg-background border-r flex-shrink-0 flex flex-col",
              "md:translate-x-0"
            )}
            initial={isSidebarOpen ? "open" : "closed"}
            animate={isSidebarOpen ? "open" : "closed"}
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-medical-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CN</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">ConvoNotes</span>
                  <span className="text-xs text-muted-foreground">Medical Documentation</span>
                </div>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                    item.active 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    item.active ? "" : "group-hover:text-primary"
                  )} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t mt-auto">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 md:py-10 px-4 md:px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
