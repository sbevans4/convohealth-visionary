
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-medical-50 to-transparent z-[-1]"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4">
              Next-Generation Medical Documentation
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-foreground mb-4">
              Document <span className="text-medical-600">Patient Care</span> Without The Burden
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              ConvoNotes uses AI to transform medical conversations into structured SOAP notes, 
              saving healthcare providers hours of documentation time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-12 px-6" asChild>
                <Link to="/auth">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                <a href="#features">
                  See How It Works
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
