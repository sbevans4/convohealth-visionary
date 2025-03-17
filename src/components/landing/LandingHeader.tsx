
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-medical-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AD</span>
          </div>
          <span className="font-display font-bold text-lg md:text-xl">AI Doctor Notes</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-medical-600 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium hover:text-medical-600 transition-colors">Pricing</a>
          <a href="#contact" className="text-sm font-medium hover:text-medical-600 transition-colors">Contact</a>
          <Link to="/auth" className="text-sm font-medium hover:text-medical-600 transition-colors">Log in</Link>
          <Button asChild>
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-sm font-medium py-2 hover:text-medical-600" 
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium py-2 hover:text-medical-600" 
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#contact" 
              className="text-sm font-medium py-2 hover:text-medical-600" 
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <div className="h-px w-full bg-border my-2"></div>
            <Link 
              to="/auth" 
              className="text-sm font-medium py-2 hover:text-medical-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
            <Button className="mt-2" asChild onClick={() => setIsMenuOpen(false)}>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
