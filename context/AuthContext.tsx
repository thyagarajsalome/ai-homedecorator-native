import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  login: () => void; // Keep for navigation types, but logic moves to screens
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes (login, logout, auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Attempt to sign out from Supabase backend
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    } finally {
      // Force local state update to ensure navigation happens
      // This handles cases where the network fails or the event listener doesn't fire
      setSession(null);
    }
  };

  // Placeholder to satisfy interface, actual login happens in LoginScreen via supabase.auth.signInWithPassword
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
