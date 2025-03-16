
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types/medical";
import { useSubscription } from "@/hooks/useSubscription";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Subscription = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { createCheckout, isLoading } = useSubscription();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check URL for query parameters
    const checkoutSuccess = searchParams.get('checkout_success');
    const checkoutCanceled = searchParams.get('checkout_canceled');
    
    if (checkoutSuccess === 'true') {
      setShowSuccessDialog(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname);
    } else if (checkoutCanceled === 'true') {
      toast.info("Your payment was canceled. You can try again when you're ready.");
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);
  
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

  const handleSubscribe = async (planId: string) => {
    if (planId === "enterprise") {
      // For enterprise plans, contact sales
      toast.info('Contact our sales team for enterprise plans');
      return;
    }
    
    // Create checkout session and redirect to Stripe
    await createCheckout(planId, billingInterval);
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.name === "Enterprise" ? "Contact Sales" : "Subscribe Now"
                  )}
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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Successful!</DialogTitle>
            <DialogDescription>
              Thank you for subscribing to MediScribe AI. Your account has been upgraded and you now have access to all the features of your plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Subscription;
