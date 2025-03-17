
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: Array<{text: string; included: boolean}>;
  recommended?: boolean;
  index: number;
  cta: string;
}

const PricingPlan = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  recommended = false,
  index,
  cta
}: PricingPlanProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className={cn(
      "rounded-xl border shadow-md overflow-hidden bg-card flex flex-col relative h-full",
      recommended ? "ring-2 ring-medical-600 lg:scale-105 z-10" : ""
    )}
  >
    {recommended && (
      <div className="bg-medical-600 text-white py-2 text-sm font-medium">
        Most Popular
      </div>
    )}
    
    <div className="p-6 lg:p-8 flex-grow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground"> {period}</span>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <span className={cn(
              "text-sm",
              !feature.included && "text-muted-foreground"
            )}>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="p-6 lg:p-8 border-t">
      <Button 
        className={cn("w-full h-12", 
          recommended ? "bg-medical-600 hover:bg-medical-700" : ""
        )} 
        variant={recommended ? "default" : "outline"} 
        asChild
      >
        <Link to="/auth?tab=signup">{cta}</Link>
      </Button>
    </div>
  </motion.div>
);

const PricingSection = () => {
  const allFeatures = [
    "Voice recording & transcription",
    "AI-generated SOAP notes",
    "Medical terminology recognition",
    "EHR integration",
    "Mobile app access",
    "ICD-10 code suggestions",
    "HIPAA compliance",
    "Priority support",
    "Custom AI model training"
  ];

  const plans = [
    {
      name: "Basic",
      price: "$99",
      period: "per month",
      description: "Perfect for individual practitioners",
      features: [
        {text: "Voice recording & transcription", included: true},
        {text: "AI-generated SOAP notes", included: true},
        {text: "Medical terminology recognition", included: true},
        {text: "5 hours of recordings per month", included: true},
        {text: "7-day storage retention", included: true},
        {text: "Mobile app access", included: true},
        {text: "ICD-10 code suggestions", included: false},
        {text: "HIPAA compliance", included: true},
        {text: "Email support", included: true},
        {text: "Custom AI model training", included: false}
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$499",
      period: "per month",
      description: "For small to medium practices",
      features: [
        {text: "Voice recording & transcription", included: true},
        {text: "AI-generated SOAP notes", included: true},
        {text: "Medical terminology recognition", included: true},
        {text: "20 hours of recordings per month", included: true},
        {text: "30-day storage retention", included: true},
        {text: "Mobile app access", included: true},
        {text: "ICD-10 code suggestions", included: true},
        {text: "HIPAA compliance", included: true},
        {text: "Priority support", included: true},
        {text: "Custom AI model training", included: false}
      ],
      recommended: true,
      cta: "Get Started Today"
    },
    {
      name: "Enterprise",
      price: "$1,999",
      period: "per month",
      description: "For large medical facilities",
      features: [
        {text: "Voice recording & transcription", included: true},
        {text: "AI-generated SOAP notes", included: true},
        {text: "Medical terminology recognition", included: true},
        {text: "Unlimited recordings", included: true},
        {text: "Unlimited storage", included: true},
        {text: "Mobile app access", included: true},
        {text: "ICD-10 code suggestions", included: true},
        {text: "HIPAA compliance", included: true},
        {text: "Dedicated account manager", included: true},
        {text: "Custom AI model training", included: true}
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-medical-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-medical-100/60 text-medical-800 text-sm font-medium mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Choose the Right Plan for Your Practice
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              recommended={plan.recommended}
              index={index}
              cta={plan.cta}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom solution? <a href="#contact" className="text-medical-600 font-medium hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
