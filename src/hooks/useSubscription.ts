
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/integrations/supabase/client";

// Constants for trial limits
const TRIAL_DAYS = 15;
const TRIAL_MINUTES_LIMIT = 60; // 1 hour in minutes

// Local storage keys
const TRIAL_START_KEY = "ai_doctor_trial_start";
const RECORDING_MINUTES_KEY = "ai_doctor_recording_minutes";

// Payment method type
export type PaymentMethod = 'card' | 'paypal';

export function useSubscription() {
  const [trialStartDate, setTrialStartDate] = useState<string | null>(null);
  const [recordingMinutesUsed, setRecordingMinutesUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load trial data on initial render
  useEffect(() => {
    // Get or initialize trial start date
    const storedTrialStart = localStorage.getItem(TRIAL_START_KEY);
    if (!storedTrialStart) {
      const now = new Date().toISOString();
      localStorage.setItem(TRIAL_START_KEY, now);
      setTrialStartDate(now);
    } else {
      setTrialStartDate(storedTrialStart);
    }
    
    // Get recording minutes used
    const storedMinutes = localStorage.getItem(RECORDING_MINUTES_KEY);
    if (storedMinutes) {
      setRecordingMinutesUsed(parseFloat(storedMinutes));
    }
  }, []);
  
  // Calculate remaining trial days
  const calculateTrialDaysRemaining = (): number => {
    if (!trialStartDate) return TRIAL_DAYS;
    
    const trialStartTime = new Date(trialStartDate).getTime();
    const currentTime = new Date().getTime();
    const elapsedDays = (currentTime - trialStartTime) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, TRIAL_DAYS - Math.floor(elapsedDays));
  };
  
  // Check if trial is expired
  const isTrialExpired = (): boolean => {
    return calculateTrialDaysRemaining() <= 0 || recordingMinutesUsed >= TRIAL_MINUTES_LIMIT;
  };
  
  // Track recording usage
  const trackRecordingUsage = (minutes: number): void => {
    if (isTrialExpired()) {
      toast.error("Your trial has expired. Please upgrade to continue using this feature.");
      return;
    }
    
    const newTotal = recordingMinutesUsed + minutes;
    setRecordingMinutesUsed(newTotal);
    localStorage.setItem(RECORDING_MINUTES_KEY, newTotal.toString());
    
    // Check if this recording put the user over the limit
    if (newTotal >= TRIAL_MINUTES_LIMIT) {
      toast.warning("You've reached your trial recording limit. Please upgrade to continue using this feature.");
    } else if (newTotal >= TRIAL_MINUTES_LIMIT * 0.8) {
      // Warn when approaching limit (80% used)
      toast.warning(`You've used ${Math.round(newTotal)} minutes of your ${TRIAL_MINUTES_LIMIT} minute trial.`);
    }
  };
  
  // Reset trial data (for testing)
  const resetTrialData = (): void => {
    localStorage.removeItem(TRIAL_START_KEY);
    localStorage.removeItem(RECORDING_MINUTES_KEY);
    const now = new Date().toISOString();
    localStorage.setItem(TRIAL_START_KEY, now);
    setTrialStartDate(now);
    setRecordingMinutesUsed(0);
    toast.success("Trial data has been reset.");
  };
  
  // Get remaining recording minutes
  const getRecordingMinutesRemaining = (): number => {
    return Math.max(0, TRIAL_MINUTES_LIMIT - recordingMinutesUsed);
  };
  
  // Check if user can access a feature based on their current plan
  const canAccessFeature = (featureName: string): boolean => {
    if (!isTrialExpired()) {
      // During active trial, all features are accessible
      return true;
    }
    
    // Once trial expires, nothing is accessible until upgrade
    return false;
  };
  
  // Get user's subscription tier
  const getUserSubscriptionTier = (): "basic" | "professional" | "enterprise" | "free" => {
    return "free"; // All users start with free tier
  };
  
  // Create checkout session
  const createCheckout = async (
    planId: string, 
    interval: 'month' | 'year', 
    paymentMethod: PaymentMethod,
    referralCode?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Create Supabase client
      const supabase = createClient();
      
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          interval,
          paymentMethod,
          referralCode: referralCode || ''
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout page
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from checkout service');
      }
    } catch (error) {
      toast.error(`Checkout error: ${error.message}`);
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // Trial-related functions
    trialDaysRemaining: calculateTrialDaysRemaining(),
    isTrialExpired,
    trialStartDate,
    resetTrialData,
    
    // Recording usage
    recordingMinutesUsed,
    getRecordingMinutesRemaining,
    trackRecordingUsage,
    TRIAL_MINUTES_LIMIT,
    
    // Feature access
    canAccessFeature,
    getUserSubscriptionTier,
    
    // Checkout
    createCheckout,
    isLoading
  };
}

