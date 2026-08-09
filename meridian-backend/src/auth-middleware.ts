import { Request, Response, NextFunction } from "express";
import { supabase } from "./supabaseClient";
import { UserRole, AuthUser } from "./types";

// Lets route handlers read req.user with proper typing.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Verifies the Supabase access token sent as `Authorization: Bearer <token>`.
 * The frontend gets this token from supabase.auth signup/login and attaches
 * it to every request that needs to know who's asking.
 *
 * Pass a role ("SEAFARER" | "EMPLOYER") to also require that specific role —
 * e.g. only employers can post a vacancy, only seafarers can apply.
 */
export function requireAuth(role?: UserRole) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Log in to do that." });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Your session has expired. Log in again." });
    }

    const userRole = data.user.user_metadata?.role as UserRole | undefined;
    if (role && userRole !== role) {
      return res.status(403).json({
        error: `This action is only available to ${role === "EMPLOYER" ? "employers" : "seafarers"}.`,
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email ?? "",
      role: userRole ?? "SEAFARER",
    };
    next();
  };
}
