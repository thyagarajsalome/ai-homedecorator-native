import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
// 👇 UPDATED IMPORT: Added initPurchases
import {
  identifyUser,
  logoutUser,
  initPurchases,
} from "../services/purchaseService";

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  login: () => void;
  logout: () => void;
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
        // 1. 👇 Initialize RevenueCat FIRST
        // This ensures the SDK is ready before we try to log the user in.
        await initPurchases();

        // 2. Check active Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        // 3. If user is logged in, link them to RevenueCat
        if (session?.user) {
          await identifyUser(session.user.id);
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Handle RevenueCat identity on auth changes
      if (session?.user) {
        identifyUser(session.user.id);
      } else {
        logoutUser();
      }
    });

    // 5. Handle Deep Links (Email Confirmation)
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      if (url.includes("access_token") || url.includes("refresh_token")) {
        try {
          const params = new URLSearchParams(url.split("#")[1]);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!session, session, login, logout }}
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
