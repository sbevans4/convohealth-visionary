
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
  index: number;
}

const PricingPlan = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  recommended = false,
  index
}: PricingPlanProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className={cn(
      "rounded-xl border shadow-soft overflow-hidden bg-card flex flex-col",
      recommended ? "ring-2 ring-medical-500 scale-105 z-10" : ""
    )}
  >
    {recommended && (
      <div className="bg-medical-500 text-white py-1.5 text-sm font-medium">
        Recommended
      </div>
    )}
    
    <div className="p-6 flex-grow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-muted-foreground"> {period}</span>
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-medical-600 mr-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="p-6 border-t">
      <Button className="w-full" variant={recommended ? "default" : "outline"} asChild>
        <Link to="/auth">Get Started</Link>
      </Button>
    </div>
  </motion.div>
);

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "$99",
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
      price: "$499",
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
      price: "$1999",
      period: "per month",
      description: "For up to 6 providers",
      features: [
        "Unlimited recordings",
        "Custom AI model training",
        "EHR integration",
        "HIPAA BAA included",
        "Dedicated account manager"
      ]
    }
  ];

  return (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
