import {
  GoogleSignin,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/supabase";

// 1. Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // PASTE YOUR WEB CLIENT ID HERE (The one in the TOP box of Supabase)
    webClientId: "PASTE_YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com",
    offlineAccess: true,
  });
};

// 2. The Sign-In Function
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    if (userInfo.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });
      return { data, error };
    } else {
      throw new Error("No ID token present!");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      return { error: { message: "Sign-in cancelled" } };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      return { error: { message: "Sign-in in progress" } };
    } else {
      // some other error happened
      console.error(error);
      return { error: { message: error.message || "Google Sign-In failed" } };
    }
  }
};
