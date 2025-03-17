
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
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
                  Join thousands of healthcare providers who save hours every day with AI Doctor Notes.
                </p>
                <Button className="bg-white text-medical-600 hover:bg-medical-50" size="lg" asChild>
                  <Link to="/auth?mode=signup">
                    Start Your Free Trial
                  </Link>
                </Button>
              </div>
              
              <div className="rounded-lg bg-white/10 p-6">
                <div className="text-lg font-medium mb-4">What our users say:</div>
                <blockquote className="italic text-medical-50">
                  "AI Doctor Notes has completely transformed our practice. I save at least 2 hours of documentation time every day and can focus more on patient care."
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
  );
};

export default CtaSection;
