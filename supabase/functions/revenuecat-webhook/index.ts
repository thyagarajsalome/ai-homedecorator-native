import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CREDIT_AMOUNTS = {
  credits_15: 15,
  credits_50: 50,
  credits_120: 120,
};

serve(async (req) => {
  const body = await req.json();
  const { event } = body;

  console.log("Received event:", event?.type);

  // 👇 THIS PART IS CRITICAL 👇
  // We MUST accept 'NON_RENEWING_PURCHASE' for one-time credits
  const acceptedEvents = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "NON_RENEWING_PURCHASE",
  ];

  if (!event || !acceptedEvents.includes(event.type)) {
    return new Response(`Ignored event type: ${event?.type}`, { status: 200 });
  }
  // 👆 --------------------- 👆

  const appUserId = event.app_user_id;
  const productId = event.product_id;
  const creditsToAdd =
    CREDIT_AMOUNTS[productId as keyof typeof CREDIT_AMOUNTS] || 0;

  if (creditsToAdd === 0) {
    console.error(`Unknown product ID: ${productId}`);
    return new Response("Unknown product", { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("generation_credits")
    .eq("id", appUserId)
    .single();

  const currentBalance = profile?.generation_credits || 0;
  const newBalance = currentBalance + creditsToAdd;

  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update({ generation_credits: newBalance })
    .eq("id", appUserId);

  if (error) {
    console.error("Failed to update credits", error);
    return new Response("Database error", { status: 500 });
  }

  return new Response(`Added ${creditsToAdd} credits`, { status: 200 });
});
