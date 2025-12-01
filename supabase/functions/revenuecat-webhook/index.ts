// supabase/functions/revenuecat-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mapping of Product ID -> Credits (Same as your frontend)
const CREDIT_AMOUNTS = {
  credits_15: 15,
  credits_50: 50,
  credits_120: 120,
};

serve(async (req) => {
  // 1. Verify the request comes from RevenueCat (optional but recommended check for a secret header)
  // const authHeader = req.headers.get('Authorization');
  // if (authHeader !== 'Bearer YOUR_INTERNAL_SECRET') return new Response('Unauthorized', {zfstatus: 401});

  const body = await req.json();
  const { event } = body;

  // 2. Only care about successful purchases (INITIAL_PURCHASE or RENEWAL)
  if (
    !event ||
    (event.type !== "INITIAL_PURCHASE" && event.type !== "RENEWAL")
  ) {
    return new Response("Ignored event type", { status: 200 });
  }

  const appUserId = event.app_user_id; // This should be your Supabase User ID
  const productId = event.product_id;
  const creditsToAdd =
    CREDIT_AMOUNTS[productId as keyof typeof CREDIT_AMOUNTS] || 0;

  if (creditsToAdd === 0) {
    return new Response("Unknown product", { status: 400 });
  }

  // 3. Connect to Supabase with ADMIN rights (Service Role Key)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // 4. Securely update the user's credits
  // First, get current balance
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("generation_credits")
    .eq("id", appUserId)
    .single();

  const currentBalance = profile?.generation_credits || 0;
  const newBalance = currentBalance + creditsToAdd;

  // Update the balance
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
