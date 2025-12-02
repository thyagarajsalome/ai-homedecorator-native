import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking"; // <--- Import Linking

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
    // 1. Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. Listen for auth changes (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Handle Deep Links (Email Confirmation)
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      // Check if the URL contains authentication parameters (Implicit or PKCE)
      // Example: aihomedecoratornative://login#access_token=...&refresh_token=...
      if (url.includes("access_token") || url.includes("refresh_token")) {
        try {
          // Extract the fragment part of the URL (after the #)
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

    // Listen for links if the app is already open
    const linkingListener = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    // Check if the app was opened by a link (cold start)
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
