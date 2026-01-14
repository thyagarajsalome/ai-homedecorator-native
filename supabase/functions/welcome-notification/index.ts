import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { record } = await req.json(); // This is the new user profile row
  const pushToken = record.push_token;

  if (pushToken) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: pushToken,
        title: "Welcome to AI Home Decorator! 🏠",
        body: "You've received 3 free credits! Start designing your dream room now.",
        data: { screen: "Home" },
      }),
    });
  }

  return new Response(JSON.stringify({ message: "Sent" }), {
    headers: { "Content-Type": "application/json" },
  });
});
