
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/types/medical";
import { useSubscription, PaymentMethod } from "@/hooks/useSubscription";
import BillingIntervalToggle from "@/components/subscription/BillingIntervalToggle";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import SubscriptionSuccessDialog from "@/components/subscription/SubscriptionSuccessDialog";
import PaymentMethodSelector from "@/components/subscription/PaymentMethodSelector";
import ReferralSystem from "@/components/subscription/ReferralSystem";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Clock, AlertTriangle } from "lucide-react";
import { formatDate } from "@/utils/formatters";

const Subscription = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { 
    createCheckout, 
    isLoading, 
    isTrialExpired, 
    trialDaysRemaining, 
    recordingMinutesUsed, 
    TRIAL_MINUTES_LIMIT,
    trialStartDate
  } = useSubscription();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Calculate trial end date
  const trialEndDate = trialStartDate ? new Date(trialStartDate) : new Date();
  if (trialStartDate) {
    trialEndDate.setDate(trialEndDate.getDate() + 15);
  }
  
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
      price: billingInterval === 'month' ? 1999 : 19990,
      interval: billingInterval,
      features: [
        "For up to 6 providers",
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
      toast.info('Contact our sales team for custom enterprise pricing');
      return;
    }
    
    // Get referral code from URL if present
    const referralCode = searchParams.get('ref') || '';
    
    // Create checkout session and redirect to Stripe
    await createCheckout(planId, billingInterval, paymentMethod, referralCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      {isTrialExpired() ? (
        <Alert className="mb-8 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle>Trial Expired</AlertTitle>
          <AlertDescription>
            Your trial period has ended. Please select a subscription plan below to continue using AI Doctor Notes.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-500" />
          <AlertTitle>Trial Mode Active</AlertTitle>
          <AlertDescription>
            You have {trialDaysRemaining} days remaining in your trial (expires {formatDate(trialEndDate)}). 
            You've used {recordingMinutesUsed.toFixed(1)} of {TRIAL_MINUTES_LIMIT} available recording minutes.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Choose the plan that works best for your practice, with no hidden fees or long-term commitments
        </p>
        
        <div className="mt-6">
          <BillingIntervalToggle 
            billingInterval={billingInterval}
            onChange={setBillingInterval}
          />
        </div>
      </div>

      {user && <ReferralSystem />}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        <PaymentMethodSelector 
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
        />
      </div>

      <SubscriptionPlans 
        plans={subscriptionPlans}
        isLoading={isLoading}
        paymentMethod={paymentMethod}
        onSubscribe={handleSubscribe}
      />

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include 7-day free trial. No credit card required to start.</p>
        <p className="mt-1">Have questions? <a href="#" className="text-primary underline">Contact our sales team</a></p>
      </div>

      <SubscriptionSuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </motion.div>
  );
};

export default Subscription;
