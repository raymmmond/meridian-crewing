import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Keyed by the logged-in user's id when available (set by requireAuth,
// which must run BEFORE these limiters in the route's middleware chain),
// falling back to IP address for anyone unauthenticated. This matters
// because IP-only limiting would unfairly throttle multiple real people
// sharing one connection — plausible for this audience (a ship's shared
// internet, an internet café).
function keyByUserOrIp(req: Request): string {
  return req.user?.id ?? req.ip ?? "unknown";
}

function limitHandler(message: string) {
  return (_req: Request, res: Response) => {
    res.status(429).json({ error: message });
  };
}

// Baseline, applied to every request — a defense-in-depth catch-all
// against a scripted attacker hammering any endpoint, not just the
// specific write actions below.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler("Too many requests. Try again in a few minutes."),
});

export const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: keyByUserOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(
    "You've submitted a lot of applications this hour. Try again later."
  ),
});

export const postVacancyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: keyByUserOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(
    "You've posted a lot of vacancies this hour. Try again later."
  ),
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: keyByUserOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler(
    "You've uploaded a lot of documents this hour. Try again later."
  ),
});
