import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "@/types/medical";

const Subscription = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: billingInterval === 'month' ? 99 : 990,
      interval: billingInterval,
      features: [
        "Up to 5 hours of recordings per month",
        "Basic SOAP note generation",
        "7-day storage retention",
        "Email support"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: billingInterval === 'month' ? 499 : 4990,
      interval: billingInterval,
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
      id: "enterprise",
      name: "Enterprise",
      price: billingInterval === 'month' ? 199 : 1990,
      interval: billingInterval,
      features: [
        "Unlimited recordings",
        "Custom AI model training",
        "EHR integration",
        "HIPAA BAA included",
        "Dedicated account manager"
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    console.log(`Selected plan: ${planId}, billing: ${billingInterval}`);
    // In a real app, this would navigate to checkout or open a payment modal
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Choose the plan that works best for your practice, with no hidden fees or long-term commitments
        </p>
        
        <div className="mt-6 inline-flex items-center rounded-full border p-1 bg-muted/50">
          <Button
            variant={billingInterval === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('month')}
            className="rounded-full"
          >
            Monthly
          </Button>
          <Button
            variant={billingInterval === 'year' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('year')}
            className="rounded-full"
          >
            Yearly (20% off)
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative ${plan.recommended ? 'mt-[-1rem] mb-[-1rem]' : ''}`}
          >
            <Card className={`h-full flex flex-col ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.name === "Enterprise" ? "For large organizations" : 
                   plan.name === "Professional" ? "For small practices" : 
                   "For individual practitioners"}
                </CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground"> per {plan.interval}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleSubscribe(plan.id)} 
                  className="w-full"
                  variant={plan.recommended ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include 7-day free trial. No credit card required to start.</p>
        <p className="mt-1">Have questions? <a href="#" className="text-primary underline">Contact our sales team</a></p>
      </div>
    </motion.div>
  );
};

export default Subscription;
