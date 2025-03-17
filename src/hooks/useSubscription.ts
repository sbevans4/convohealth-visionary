
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type PaymentMethod = 'card' | 'paypal';
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

// Constants for trial limits
const TRIAL_DAYS_LIMIT = 15; // 15 day trial
const TRIAL_MINUTES_LIMIT = 60; // 1 hour in minutes

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(TRIAL_DAYS_LIMIT);
  const [recordingMinutesUsed, setRecordingMinutesUsed] = useState(0);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const { user } = useAuth();

  // Initialize or get trial information
  useEffect(() => {
    if (!user) return;

    const loadTrialInfo = async () => {
      // Get trial start date from local storage
      const storedTrialStart = localStorage.getItem('trialStartDate');
      
      if (storedTrialStart) {
        const startDate = new Date(storedTrialStart);
        setTrialStartDate(startDate);
        
        // Calculate days remaining
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, TRIAL_DAYS_LIMIT - diffDays);
        setTrialDaysRemaining(remaining);
      } else {
        // Start the trial now
        const today = new Date();
        localStorage.setItem('trialStartDate', today.toISOString());
        setTrialStartDate(today);
        setTrialDaysRemaining(TRIAL_DAYS_LIMIT);
      }
      
      // Get recording minutes used
      const storedMinutes = localStorage.getItem('recordingMinutesUsed');
      if (storedMinutes) {
        setRecordingMinutesUsed(parseFloat(storedMinutes));
      }
    };
    
    loadTrialInfo();
  }, [user]);

  // Get the user's current subscription tier
  const getUserSubscriptionTier = (): SubscriptionTier => {
    // If not logged in, still provide free tier access
    if (!user) return 'free';
    
    // In a real app, this would check Supabase for subscription status
    // For now, we'll default everyone to free tier
    return 'free';
  };

  // Check if a user can access a certain feature based on their tier
  const canAccessFeature = (requiredTier: SubscriptionTier): boolean => {
    const currentTier = getUserSubscriptionTier();
    
    // Free tier can access free features
    if (requiredTier === 'free') return true;
    
    // Check if trial is expired either by days or minutes
    if (trialDaysRemaining <= 0 || recordingMinutesUsed >= TRIAL_MINUTES_LIMIT) {
      return false;
    }
    
    // In demo mode, allow access to all features during trial period
    return true;
  };

  // Track recording time usage
  const trackRecordingUsage = (minutes: number) => {
    const newTotal = recordingMinutesUsed + minutes;
    setRecordingMinutesUsed(newTotal);
    localStorage.setItem('recordingMinutesUsed', newTotal.toString());
  };

  // Calculate minutes remaining
  const getRecordingMinutesRemaining = (): number => {
    return Math.max(0, TRIAL_MINUTES_LIMIT - recordingMinutesUsed);
  };

  // Check if trial has expired
  const isTrialExpired = (): boolean => {
    return trialDaysRemaining <= 0 || recordingMinutesUsed >= TRIAL_MINUTES_LIMIT;
  };

  const createCheckout = async (
    planId: string, 
    interval: 'month' | 'year', 
    paymentMethod: PaymentMethod = 'card',
    referralCode?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, interval, paymentMethod, referralCode },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      toast.error('Failed to process payment. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckout,
    isLoading,
    getUserSubscriptionTier,
    canAccessFeature,
    trialDaysRemaining,
    recordingMinutesUsed,
    trialStartDate,
    trackRecordingUsage,
    getRecordingMinutesRemaining,
    isTrialExpired,
    TRIAL_DAYS_LIMIT,
    TRIAL_MINUTES_LIMIT
  };
}
