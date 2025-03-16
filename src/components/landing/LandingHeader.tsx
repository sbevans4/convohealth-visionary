
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingHeader = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-medical-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AD</span>
          </div>
          <span className="font-display font-semibold text-lg">AI Doctor Notes</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </nav>
        
        <div className="md:hidden">
          <Button asChild>
            <Link to="/auth">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
