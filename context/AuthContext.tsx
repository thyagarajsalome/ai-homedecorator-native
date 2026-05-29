import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Platform, View, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Purchases from "react-native-purchases";
// 👇 Import the notification service
import { registerForPushNotificationsAsync } from "../services/notificationService";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

if (GOOGLE_WEB_CLIENT_ID) {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: true,
  });
}

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  login: () => void;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wrapper function to handle async initialization order
    const initializeApp = async () => {
      try {


        // 2. Check active Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        // 2. If user is logged in, register for notifications and RevenueCat
        if (session?.user) {
          // 👇 Register notifications on app start if session exists
          registerForPushNotificationsAsync(session.user.id);
          if (Platform.OS === "android") {
            try {
              await Purchases.logIn(session.user.id);
            } catch (e) {
              console.error("RevenueCat logIn error on app start:", e);
            }
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run the initialization
    initializeApp();

    // 4. Listen for auth changes (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      // Handle notifications and RevenueCat login on auth changes
      if (session?.user) {
        // 👇 Register notifications whenever a user logs in
        registerForPushNotificationsAsync(session.user.id);
        if (Platform.OS === "android") {
          try {
            await Purchases.logIn(session.user.id);
          } catch (e) {
            console.error("RevenueCat logIn error on auth change:", e);
          }
        }
      }
    });

    // 5. Handle Deep Links (Email Confirmation)
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      if (url.includes("access_token") || url.includes("refresh_token")) {
        try {
          const normalizedUrl = url.replace("#", "?");
          const urlObj = new URL(normalizedUrl);
          const accessToken = urlObj.searchParams.get("access_token");
          const refreshToken = urlObj.searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        } catch (error) {
          console.error("Deep link parsing error:", error);
        }
      }
    };

    const linkingListener = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.unsubscribe();
      linkingListener.remove();
    };
  }, []);

  const logout = async () => {
    try {
      if (Platform.OS === "android") {
        try {
          await Purchases.logOut();
        } catch (e) {
          console.error("RevenueCat logOut error:", e);
        }
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setSession(null);
    }
  };

  const login = () => {};

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === "web" || !GOOGLE_WEB_CLIENT_ID) {
        const redirectUrl = Linking.createURL("login");
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        return;
      }

      // Native flow using Google Sign-In
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google Sign-In");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!session, session, login, logout, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
