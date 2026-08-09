import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export type UserRole = "SEAFARER" | "EMPLOYER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    role: (supabaseUser.user_metadata?.role as UserRole) ?? "SEAFARER",
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session (e.g. the browser was refreshed).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
        setUser(toAuthUser(data.session.user));
      }
      setLoading(false);
    });

    // Supabase fires this on login, logout, token refresh, and on load —
    // keeping our state in sync automatically rather than us polling it.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setUser(toAuthUser(session.user));
      } else {
        setToken(null);
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signup: AuthContextValue["signup"] = async (email, password, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    if (error) throw new Error(error.message);
    if (!data.session) {
      // This happens if "Confirm email" is switched on in Supabase — the
      // account is created but can't log in until the link is clicked.
      throw new Error(
        "Account created, but email confirmation is required before you can log in. Turn off 'Confirm email' in Supabase (Authentication → Providers → Email) while testing."
      );
    }
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const logout = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
