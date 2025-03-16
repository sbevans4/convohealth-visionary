
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.2.0";

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
    const { planId, interval } = await req.json();
    
    // Map plan ID and interval to Stripe price IDs
    const priceMap = {
      basic: {
        month: "price_basic_monthly",
        year: "price_basic_yearly",
      },
      professional: {
        month: "price_professional_monthly",
        year: "price_professional_yearly",
      },
      enterprise: {
        month: "price_enterprise_monthly",
        year: "price_enterprise_yearly",
      },
    };

    // Live Stripe price ID - provided by the user
    const liveStripeTestPriceId = "pk_live_51QjmPSG6caIOrfNTV3mRxfxPwgMLysXeKK6muGBAXMM5c5HB8jRPlACgVzpSlGqjTDfg50x0ijR5eOiQDS69xuY5006ay99pJQ";
    
    const successUrl = new URL(req.url).origin + "/dashboard?checkout_success=true";
    const cancelUrl = new URL(req.url).origin + "/subscription?checkout_canceled=true";

    console.log(`Creating checkout session for plan: ${planId}, interval: ${interval}`);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: liveStripeTestPriceId, // Use the live price ID provided by user
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

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
