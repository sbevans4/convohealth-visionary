
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type PaymentMethod = 'card' | 'paypal';
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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
    
    // For demo purposes, grant access to all features
    // In production, you would implement proper tier checking here
    return true;
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
    canAccessFeature
  };
}
