
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Mic, 
  FileText, 
  Shield, 
  Zap, 
  Check,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-medical-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">CN</span>
            </div>
            <span className="font-display font-semibold text-lg">ConvoNotes Medical</span>
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

      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Transforming Medical Documentation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge voice recognition with medical AI to deliver accurate, 
              compliant documentation in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Voice Recording",
                description: "Record patient encounters with crystal-clear audio capture optimized for medical environments."
              },
              {
                icon: FileText,
                title: "Instant SOAP Notes",
                description: "Convert conversations into properly formatted SOAP notes with AI that understands medical terminology."
              },
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description: "End-to-end encryption and secure data handling that meets or exceeds all privacy requirements."
              },
              {
                icon: BrainCircuit,
                title: "Medical AI Analysis",
                description: "Intelligent suggestions for diagnosis codes and treatment plans based on the conversation."
              },
              {
                icon: Zap,
                title: "Time Saving",
                description: "Reduce documentation time by up to 75%, letting you focus more on patient care."
              },
              {
                icon: Shield,
                title: "Mobile Optimized",
                description: "Purpose-built for Android devices with intuitive controls and offline capability."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-xl p-6 border shadow-soft h-full flex flex-col"
              >
                <div className="h-12 w-12 rounded-lg bg-medical-100 text-medical-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-medical-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your practice, with no hidden fees or long-term commitments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "$29",
                period: "per month",
                description: "For individual practitioners",
                features: [
                  "Up to 5 hours of recordings per month",
                  "Basic SOAP note generation",
                  "7-day storage retention",
                  "Email support"
                ]
              },
              {
                name: "Professional",
                price: "$79",
                period: "per month",
                description: "For small practices",
                features: [
                  "Up to 20 hours of recordings per month",
                  "Advanced SOAP note generation",
                  "30-day storage retention",
                  "Medical image analysis",
                  "Priority support"
                ],
                recommended: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large organizations",
                features: [
                  "Unlimited recordings",
                  "Custom AI model training",
                  "EHR integration",
                  "HIPAA BAA included",
                  "Dedicated account manager"
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "rounded-xl border shadow-soft overflow-hidden bg-card flex flex-col",
                  plan.recommended ? "ring-2 ring-medical-500 scale-105 z-10" : ""
                )}
              >
                {plan.recommended && (
                  <div className="bg-medical-500 text-white py-1.5 text-sm font-medium">
                    Recommended
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-medical-600 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 border-t">
                  <Button className="w-full" variant={plan.recommended ? "default" : "outline"} asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-medical-600 rounded-2xl overflow-hidden shadow-glow">
            <div className="p-8 md:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-display font-semibold mb-4">
                    Ready to transform your medical documentation?
                  </h2>
                  <p className="text-medical-100 mb-6">
                    Join thousands of healthcare providers who save hours every day with ConvoNotes Medical.
                  </p>
                  <Button className="bg-white text-medical-600 hover:bg-medical-50" size="lg" asChild>
                    <Link to="/auth">
                      Start Your Free Trial
                    </Link>
                  </Button>
                </div>
                
                <div className="rounded-lg bg-white/10 p-6">
                  <div className="text-lg font-medium mb-4">What our users say:</div>
                  <blockquote className="italic text-medical-50">
                    "ConvoNotes has completely transformed our practice. I save at least 2 hours of documentation time every day and can focus more on patient care."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/20"></div>
                    <div className="ml-3">
                      <div className="font-medium">Dr. Sarah Johnson</div>
                      <div className="text-sm text-medical-200">Family Medicine</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-medical-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CN</span>
                </div>
                <span className="font-display font-semibold">ConvoNotes Medical</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered medical documentation for the modern healthcare provider.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/hipaa" className="text-muted-foreground hover:text-primary transition-colors">HIPAA Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div>© {new Date().getFullYear()} ConvoNotes Medical. All rights reserved.</div>
            <div className="mt-4 md:mt-0">
              Made with care for healthcare providers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
