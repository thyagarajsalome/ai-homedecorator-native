import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  identifyUser,
  logoutUser,
  initPurchases,
} from "../services/purchaseService";
// 👇 Import the notification service
import { registerForPushNotificationsAsync } from "../services/notificationService";

WebBrowser.maybeCompleteAuthSession();

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
        // 1. Initialize RevenueCat FIRST
        await initPurchases();

        // 2. Check active Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        // 3. If user is logged in, link identity and register for notifications
        if (session?.user) {
          await identifyUser(session.user.id); //
          // 👇 Register notifications on app start if session exists
          registerForPushNotificationsAsync(session.user.id);
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

      // Handle identity and notifications on auth changes
      if (session?.user) {
        await identifyUser(session.user.id); //
        // 👇 Register notifications whenever a user logs in
        registerForPushNotificationsAsync(session.user.id);
      } else {
        await logoutUser(); //
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
      await supabase.auth.signOut();
      // Ensure logout from RevenueCat
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setSession(null);
    }
  };

  const login = () => {};

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL("login");

      if (Platform.OS === "web") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        return;
      }

      // Native (iOS/Android) secure browser popup flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No URL returned from Supabase OAuth");

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === "success" && result.url) {
        const urlObj = new URL(result.url.replace("#", "?"));
        const accessToken = urlObj.searchParams.get("access_token");
        const refreshToken = urlObj.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
        }
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!session, session, login, logout, signInWithGoogle }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
