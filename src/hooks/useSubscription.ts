
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckout = async (planId: string, interval: 'month' | 'year') => {
    try {
      setIsLoading(true);
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, interval },
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
  };
}
