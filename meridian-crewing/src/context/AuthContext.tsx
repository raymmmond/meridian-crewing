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
  passwordRecoveryMode: boolean;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
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
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);

  useEffect(() => {
    // Check for an existing session (e.g. the browser was refreshed).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
        setUser(toAuthUser(data.session.user));
      }
      setLoading(false);
    });

    // Supabase fires PASSWORD_RECOVERY specifically when someone lands here
    // via a reset-password email link — that's our cue to show the "set a
    // new password" form instead of treating it as a normal login.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecoveryMode(true);
      }
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
        "Account created — check your email to confirm before logging in."
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

  const requestPasswordReset: AuthContextValue["requestPasswordReset"] = async (
    email
  ) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw new Error(error.message);
  };

  const updatePassword: AuthContextValue["updatePassword"] = async (
    newPassword
  ) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    setPasswordRecoveryMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        passwordRecoveryMode,
        signup,
        login,
        logout,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
