
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
    const { planId, interval } = await req.json();
    
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

    console.log(`Creating checkout session for plan: ${planId}, interval: ${interval}, price ID: ${stripePriceId}`);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
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
