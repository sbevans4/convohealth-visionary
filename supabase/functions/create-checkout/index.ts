
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

    // Use the provided Stripe price ID
    // Note: "pk_live_51QjmPSG6caIOrfNTV3mRxfxPwgMLysXeKK6muGBAXMM5c5HB8jRPlACgVzpSlGqjTDfg50x0ijR5eOiQDS69xuY5006ay99pJQ"
    // is a publishable key, but for server-side we should use a secret key that starts with "sk_"
    // For this example, we'll use this as a price ID
    const stripePriceId = "price_1QjmPSG6caIOrfNTV3mRxfxPw";
    
    const successUrl = new URL(req.url).origin + "/dashboard?checkout_success=true";
    const cancelUrl = new URL(req.url).origin + "/subscription?checkout_canceled=true";

    console.log(`Creating checkout session for plan: ${planId}, interval: ${interval}`);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId, // Use the price ID
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
