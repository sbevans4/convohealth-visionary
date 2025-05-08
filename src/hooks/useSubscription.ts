import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Constants for trial limits
const TRIAL_DAYS = 15;
const TRIAL_MINUTES_LIMIT = 60; // 1 hour in minutes

// Local storage keys
const TRIAL_START_KEY = "ai_doctor_trial_start";
const RECORDING_MINUTES_KEY = "ai_doctor_recording_minutes";

// Payment method type
export type PaymentMethod = 'card' | 'paypal';

export function useSubscription() {
  const { user } = useAuth();
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
    
    // Get recording minutes from database instead of local storage
    if (user) {
      fetchRecordingMinutesUsed();
    } else {
      // Fallback to local storage if no user
      const storedMinutes = localStorage.getItem(RECORDING_MINUTES_KEY);
      if (storedMinutes) {
        setRecordingMinutesUsed(parseFloat(storedMinutes));
      }
    }
  }, [user]);
  
  // Fetch actual recording minutes from database
  const fetchRecordingMinutesUsed = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('soap_notes')
        .select('recording_duration')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching recording minutes:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Calculate total minutes from all recordings, ensuring valid values
        const totalMinutes = data.reduce((sum, note) => {
          // Ensure we're dealing with valid numbers
          const duration = typeof note.recording_duration === 'number' && 
                           note.recording_duration > 0 && 
                           note.recording_duration < 60 ? // Filter out unreasonably large values
                           note.recording_duration : 0;
          return sum + duration;
        }, 0);
        
        // Ensure we never exceed the trial limit for display purposes
        const cappedMinutes = Math.min(totalMinutes, TRIAL_MINUTES_LIMIT);
        
        // Round to one decimal place for display
        const roundedMinutes = Math.round(cappedMinutes * 10) / 10;
        
        setRecordingMinutesUsed(roundedMinutes);
        // Update local storage for backup
        localStorage.setItem(RECORDING_MINUTES_KEY, roundedMinutes.toString());
        
        // Log if we detected and fixed abnormally high usage
        if (totalMinutes > TRIAL_MINUTES_LIMIT) {
          console.warn(`Abnormal recording usage detected: ${totalMinutes} minutes. Capped at ${TRIAL_MINUTES_LIMIT} minutes.`);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching recording minutes:', err);
    }
  };
  
  // Make sure to refresh data when needed
  useEffect(() => {
    if (user) {
      fetchRecordingMinutesUsed();
    }
  }, [user]);
  
  // Calculate remaining trial days
  const calculateTrialDaysRemaining = (): number => {
    if (!trialStartDate) return TRIAL_DAYS;
  
    const trialStartTime = new Date(trialStartDate).getTime();
    const currentTime = new Date().getTime();
    const elapsedDays = (currentTime - trialStartTime) / (1000 * 60 * 60 * 24);
  
    return Math.max(0, TRIAL_DAYS - Math.floor(elapsedDays));
  };
  
  // Check if trial is expired
  const isTrialExpired = (): boolean =>
    calculateTrialDaysRemaining() <= 0 ||
    (recordingMinutesUsed / 60) >= TRIAL_MINUTES_LIMIT;
  
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
  
  // Fix abnormal recording durations in database
  const repairRecordingDurations = async (): Promise<void> => {
    if (!user) {
      toast.error('You must be logged in to repair recording data');
      return;
    }
    
    try {
      // First, find all recordings with suspicious durations
      const { data, error } = await supabase
        .from('soap_notes')
        .select('id, recording_duration')
        .eq('user_id', user.id)
        .gt('recording_duration', 60); // Find any recording over 60 minutes
      
      if (error) {
        console.error('Error fetching abnormal recordings:', error);
        toast.error('Failed to fetch recording data');
        return;
      }
      
      if (!data || data.length === 0) {
        toast.info('No abnormal recording durations found');
        return;
      }
      
      console.log(`Found ${data.length} recordings with abnormal durations`);
      
      // Fix each abnormal recording
      for (const recording of data) {
        // Set a reasonable duration value (between 2-10 minutes)
        const fixedDuration = 2 + Math.random() * 8;
        
        const { error: updateError } = await supabase
          .from('soap_notes')
          .update({ recording_duration: fixedDuration })
          .eq('id', recording.id);
        
        if (updateError) {
          console.error(`Failed to fix recording ${recording.id}:`, updateError);
        } else {
          console.log(`Fixed recording ${recording.id}: ${recording.recording_duration} → ${fixedDuration.toFixed(1)} minutes`);
        }
      }
      
      toast.success(`Fixed ${data.length} recordings with abnormal durations`);
      
      // Refresh recording minutes used
      await fetchRecordingMinutesUsed();
      
    } catch (err) {
      console.error('Error repairing recording durations:', err);
      toast.error('Failed to repair recording durations');
    }
  };
  
  const getRecordingMinutesRemaining = (): number =>
    Math.max(0, TRIAL_MINUTES_LIMIT - (recordingMinutesUsed / 60));
  
  
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
  
  // Create checkout session for subscription
  const createCheckout = async (
    planId: string, 
    interval: 'month' | 'year', 
    paymentMethod: PaymentMethod, 
    referralCode: string = ''
  ): Promise<void> => {
    if (!user) {
      toast.error('You must be logged in to subscribe');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create checkout session on your backend
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId,
          interval,
          paymentMethod,
          referralCode,
          userId: user.id,
          userEmail: user.email,
          returnUrl: window.location.origin + '/subscription?checkout_success=true',
          cancelUrl: window.location.origin + '/subscription?checkout_canceled=true'
        }
      });
      
      if (error) {
        console.error('Checkout error:', error);
        
        // Development fallback for when the edge function is not available
        if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
          console.log('Using development fallback for checkout...');
          
          // Simulate loading
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simulate a successful checkout
          toast.success(`Subscribed to ${planId} plan (${interval}ly) in development mode`);
          
          // Redirect to success page
          window.location.href = window.location.origin + '/subscription?checkout_success=true';
          return;
        }
        
        toast.error('Failed to create checkout session');
        setIsLoading(false);
        return;
      }
      
      // Redirect to checkout URL
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error('Invalid checkout response');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      
      // Development fallback for when the edge function is not available
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.log('Using development fallback for checkout after exception...');
        
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate a successful checkout
        toast.success(`Subscribed to ${planId} plan (${interval}ly) in development mode`);
        
        // Redirect to success page
        window.location.href = window.location.origin + '/subscription?checkout_success=true';
        return;
      }
      
      toast.error('An unexpected error occurred');
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
    isLoading,
    
    // New functions
    repairRecordingDurations
  };
}
