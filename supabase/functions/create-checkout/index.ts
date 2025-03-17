
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.2.0";

// Initialize Stripe with the secret key from environment
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, interval, paymentMethod, referralCode } = await req.json();
    
    // Map plan ID and interval to Stripe price IDs
    // Note: These should be replaced with your actual Stripe price IDs from your Stripe dashboard
    const priceMap = {
      basic: {
        month: "price_basic_monthly", // Replace with actual Stripe price ID
        year: "price_basic_yearly",   // Replace with actual Stripe price ID
      },
      professional: {
        month: "price_professional_monthly", // Replace with actual Stripe price ID
        year: "price_professional_yearly",   // Replace with actual Stripe price ID
      },
      enterprise: {
        month: "price_enterprise_monthly", // Replace with actual Stripe price ID
        year: "price_enterprise_yearly",   // Replace with actual Stripe price ID
      },
    };

    // Get the Stripe price ID based on the plan and interval
    const stripePriceId = priceMap[planId]?.[interval];
    
    if (!stripePriceId) {
      throw new Error(`Invalid plan (${planId}) or interval (${interval})`);
    }
    
    const successUrl = new URL(req.url).origin + "/dashboard?checkout_success=true";
    const cancelUrl = new URL(req.url).origin + "/subscription?checkout_canceled=true";

    console.log(`Creating checkout session for plan: ${planId}, interval: ${interval}, payment method: ${paymentMethod}, price ID: ${stripePriceId}, referral code: ${referralCode || 'none'}`);
    
    // Determine payment method types based on user selection
    const paymentMethodTypes = paymentMethod === 'paypal' ? ['paypal'] : ['card'];
    
    // Define checkout session parameters
    const sessionParams = {
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Add discount if referral code is present
    if (referralCode) {
      // Store metadata about the referral for later processing
      sessionParams.metadata = {
        referralCode,
      };
      
      // Apply a 10% discount for the first month
      // Note: In Stripe, you would create a coupon for this
      const coupon = await getOrCreateReferralCoupon();
      if (coupon) {
        sessionParams.discounts = [
          {
            coupon: coupon.id,
          },
        ];
      }
    }
    
    // Create Stripe checkout session with specified parameters
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Return the session ID to the client
    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to get or create a referral coupon in Stripe
async function getOrCreateReferralCoupon() {
  try {
    // Look for existing coupon
    const couponId = 'colleague-referral-10-percent';
    
    try {
      // Try to retrieve existing coupon
      const existingCoupon = await stripe.coupons.retrieve(couponId);
      return existingCoupon;
    } catch (error) {
      // Coupon doesn't exist, create it
      const newCoupon = await stripe.coupons.create({
        id: couponId,
        percent_off: 10,
        duration: 'once',  // Apply only to the first payment
        name: 'Colleague Referral - 10% Off',
      });
      
      return newCoupon;
    }
  } catch (error) {
    console.error("Error managing referral coupon:", error);
    return null;
  }
}
