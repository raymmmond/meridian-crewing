import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Position,
  Application,
  fetchPositions,
  fetchApplications,
  createPosition,
  createApplication,
  withdrawApplication,
} from "../api";
import { useAuth } from "./AuthContext";

interface CrewingContextValue {
  positions: Position[];
  applications: Application[];
  loading: boolean;
  connectionError: string | null;
  addPosition: (p: Omit<Position, "id" | "employer" | "filled">) => Promise<void>;
  addApplication: (a: Omit<Application, "id" | "submitted" | "status">) => Promise<void>;
  removeApplication: (applicationId: string) => Promise<void>;
}

const CrewingContext = createContext<CrewingContextValue | null>(null);

export const CrewingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, user, loading: authLoading } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Open positions are public — load them regardless of login state.
  useEffect(() => {
    let cancelled = false;
    fetchPositions()
      .then((pos) => {
        if (!cancelled) {
          setPositions(pos);
          setConnectionError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setConnectionError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Applications are private to the logged-in seafarer — only fetch once
  // we know who's logged in, and clear them out on logout so one person's
  // browser never shows a trace of another's applications.
  useEffect(() => {
    if (authLoading) return;
    if (!token || user?.role !== "SEAFARER") {
      setApplications([]);
      return;
    }
    let cancelled = false;
    fetchApplications(token)
      .then((apps) => {
        if (!cancelled) setApplications(apps);
      })
      .catch(() => {
        // Not surfaced as a connection error — a seafarer with a fresh
        // account having zero applications isn't a failure state.
      });
    return () => {
      cancelled = true;
    };
  }, [token, user?.role, authLoading]);

  const addPosition: CrewingContextValue["addPosition"] = async (p) => {
    if (!token) throw new Error("Log in as an employer to post a vacancy.");
    const created = await createPosition(p, token);
    setPositions((prev) => [created, ...prev]);
  };

  const addApplication: CrewingContextValue["addApplication"] = async (a) => {
    if (!token) throw new Error("Log in to apply for a position.");
    const created = await createApplication(a, token);
    setApplications((prev) => [created, ...prev]);
  };

  const removeApplication: CrewingContextValue["removeApplication"] = async (
    applicationId
  ) => {
    if (!token) throw new Error("Log in to withdraw an application.");
    await withdrawApplication(applicationId, token);
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  return (
    <CrewingContext.Provider
      value={{
        positions,
        applications,
        loading,
        connectionError,
        addPosition,
        addApplication,
        removeApplication,
      }}
    >
      {children}
    </CrewingContext.Provider>
  );
};

export function useCrewing(): CrewingContextValue {
  const ctx = useContext(CrewingContext);
  if (!ctx) {
    throw new Error("useCrewing must be used inside CrewingProvider");
  }
  return ctx;
}
