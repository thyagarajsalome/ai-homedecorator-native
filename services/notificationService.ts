// services/notificationService.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "19ed4d08-d954-435d-84bd-888f29d550dc", // Find this in app.json or Expo dashboard
    })
  ).data;

  // Save the token to your Supabase 'user_profiles' table
  // Ensure you have a 'push_token' column (Text type) in that table
  await supabase
    .from("user_profiles")
    .update({ push_token: token })
    .eq("id", userId);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
