
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 md:py-28" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-medical-600 to-medical-700 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Ready to transform your documentation workflow?
                </h2>
                <p className="text-medical-100 text-lg mb-8">
                  Join 3,000+ healthcare providers who save hours every day with AI Doctor Notes.
                </p>
                <div className="space-y-4">
                  <Button className="bg-white hover:bg-medical-50 text-medical-600 w-full sm:w-auto h-12 px-8 shadow-lg font-medium text-base" asChild>
                    <Link to="/auth?tab=signup" className="inline-flex items-center">
                      Start Your Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <p className="text-sm text-medical-100">No credit card required. 14-day free trial.</p>
                </div>
              </div>
              
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-white font-medium">4.9/5 from 200+ reviews</span>
                </div>
                <blockquote className="italic text-medical-50 relative">
                  <span className="text-5xl font-serif absolute -top-4 -left-2 opacity-20">"</span>
                  <p className="relative z-10">
                    AI Doctor Notes has completely transformed our practice. I save at least 2 hours of documentation time every day and can focus more on patient care. The accuracy is remarkable.
                  </p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-medical-300 flex items-center justify-center text-medical-800 font-bold text-lg">SJ</div>
                  <div className="ml-3">
                    <div className="font-medium">Dr. Sarah Johnson</div>
                    <div className="text-sm text-medical-200">Family Medicine, Chicago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-medical-600 mb-2">3,000+</div>
            <div className="text-sm text-muted-foreground">Healthcare providers trust us</div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-medical-600 mb-2">120,000+</div>
            <div className="text-sm text-muted-foreground">Hours saved annually</div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-4xl font-bold text-medical-600 mb-2">99.8%</div>
            <div className="text-sm text-muted-foreground">Documentation accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
