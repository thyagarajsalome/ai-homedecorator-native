// supabase/functions/welcome-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

serve(async (req) => {
  try {
    // 1. Get the new user record from the database webhook
    const { record } = await req.json();
    const pushToken = record.push_token;

    // 2. Only proceed if the user has a valid push token
    if (!pushToken) {
      console.log("No push token found for user:", record.id);
      return new Response(JSON.stringify({ message: "No token, skipping." }), {
        status: 200,
      });
    }

    // 3. Send the notification to Expo's servers
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        sound: "default",
        title: "Welcome to AI Home Decorator! 🏠",
        body: "We've given you free credits to start! Transform your first room today.",
        data: { screen: "Home" },
      }),
    });

    const result = await response.json();
    console.log("Notification sent:", result);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
