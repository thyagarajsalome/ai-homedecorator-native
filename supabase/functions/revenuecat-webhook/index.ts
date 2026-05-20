import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mapping of Product ID -> Credits
const CREDIT_AMOUNTS = {
  // Production product IDs
  credits_15: 15,
  credits_50: 50,
  credits_120: 120,
  
  // Web fallback / development IDs
  starter_pack: 15,
  pro_pack: 50,
  ultimate_pack: 120,
  starter: 15,
  pro: 50,
  ultimate: 120,
};

serve(async (req) => {
  try {
    const body = await req.json();
    const { event } = body;

    console.log("Received RevenueCat webhook event:", event?.type);

    const acceptedEvents = [
      "INITIAL_PURCHASE",
      "RENEWAL",
      "NON_RENEWING_PURCHASE",
    ];

    if (!event || !acceptedEvents.includes(event.type)) {
      return new Response(`Ignored event type: ${event?.type}`, { status: 200 });
    }

    const appUserId = event.app_user_id;
    const productId = event.product_id;
    const creditsToAdd = CREDIT_AMOUNTS[productId as keyof typeof CREDIT_AMOUNTS] || 0;

    if (creditsToAdd === 0) {
      console.error(`Unknown product ID: ${productId}`);
      return new Response(`Unknown product: ${productId}`, { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration environment variables.");
      return new Response("Configuration error", { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error: fetchError } = await supabaseAdmin
      .from("user_profiles")
      .select("generation_credits")
      .eq("id", appUserId)
      .single();

    if (fetchError) {
      console.error(`Failed to fetch profile for user ${appUserId}:`, fetchError.message);
      return new Response("User not found", { status: 404 });
    }

    const currentBalance = profile?.generation_credits || 0;
    const newBalance = currentBalance + creditsToAdd;

    const { error: updateError } = await supabaseAdmin
      .from("user_profiles")
      .update({ generation_credits: newBalance })
      .eq("id", appUserId);

    if (updateError) {
      console.error("Failed to update credits:", updateError.message);
      return new Response("Database error", { status: 500 });
    }

    console.log(`Successfully added ${creditsToAdd} credits to user ${appUserId}. New balance: ${newBalance}`);
    return new Response(`Added ${creditsToAdd} credits`, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing structural error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
