import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.2.0";

// Define TypeScript interface for session parameters
interface CheckoutSessionParams {
  payment_method_types: string[];
  line_items: Array<{
    price: string;
    quantity: number;
  }>;
  mode: string;
  success_url: string;
  cancel_url: string;
  metadata?: {
    referralCode: string;
  };
  discounts?: Array<{
    coupon: string;
  }>;
}

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
    // Update these with your actual Stripe price IDs
    const priceMap = {
      basic: {
        month: "price_1OuM8aEVAuNpVdbGKUVzGtTj", // Basic monthly price ID
        year: "price_1OuM8wEVAuNpVdbGcCqyBW3L",  // Basic yearly price ID
      },
      professional: {
        month: "price_1OuM9REVAuNpVdbGvnLExAkJ", // Professional monthly price ID
        year: "price_1OuM9oEVAuNpVdbGkhZKlgUb",  // Professional yearly price ID
      },
      enterprise: {
        month: "price_1OuMAIEVAuNpVdbGpZB4YX1Q", // Enterprise monthly price ID
        year: "price_1OuMAfEVAuNpVdbGMhWuhN7E",  // Enterprise yearly price ID
      },
    };

    // Get the Stripe price ID based on the plan and interval
    const stripePriceId = priceMap[planId]?.[interval];
    
    if (!stripePriceId) {
      return new Response(
        JSON.stringify({ error: `Invalid plan (${planId}) or interval (${interval})` }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    const successUrl = new URL(req.url).origin + "/dashboard?checkout_success=true";
    const cancelUrl = new URL(req.url).origin + "/subscription?checkout_canceled=true";

    console.log(`Creating checkout session for plan: ${planId}, interval: ${interval}, payment method: ${paymentMethod}, price ID: ${stripePriceId}, referral code: ${referralCode || 'none'}`);
    
    // Determine payment method types based on user selection
    const paymentMethodTypes = paymentMethod === 'paypal' ? ['paypal'] : ['card'];
    
    // Define checkout session parameters
    const sessionParams: CheckoutSessionParams = {
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
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);

      // Return the session ID to the client
      return new Response(
        JSON.stringify({ id: session.id, url: session.url }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      return new Response(
        JSON.stringify({ 
          error: "Stripe API error", 
          details: stripeError.message,
          code: stripeError.code || 'unknown' 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
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
