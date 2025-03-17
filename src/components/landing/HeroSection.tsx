
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-medical-50 to-transparent z-[-1]"></div>
      <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] bg-no-repeat bg-cover opacity-5 z-[-1]"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4 shadow-sm">
              Trusted by 3,000+ Healthcare Providers
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6">
              Transform <span className="text-medical-600 relative">
                Patient Care
                <span className="absolute bottom-2 left-0 w-full h-3 bg-medical-100 -z-10"></span>
              </span> Without The Paperwork
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ConvoNotes uses AI to create perfect SOAP notes in seconds, 
              <span className="font-medium text-medical-700"> saving you 2+ hours every day</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-14 px-8 text-base font-medium gap-2 shadow-md hover:shadow-lg transition-all" asChild>
                <Link to="/auth?tab=signup">
                  Start Your Free Trial
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-medium border-2" asChild>
                <a href="#features">
                  See How It Works
                </a>
              </Button>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>14-Day Free Trial</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
