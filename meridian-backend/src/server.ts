import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./supabaseClient";
import { requireAuth } from "./auth-middleware";
import { Position, Application, Rank, ApplicationStatus } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

const VALID_RANKS: Rank[] = ["OFFICER", "RATING", "CATERING"];
const VALID_STATUSES: ApplicationStatus[] = ["SUBMITTED", "SHORTLISTED", "OFFERED", "REJECTED"];
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Maps our camelCase API shape to Postgres' snake_case columns, and back.
function toApiPosition(row: any): Position {
  return {
    id: row.id,
    rank: row.rank,
    role: row.role,
    vessel: row.vessel,
    vesselType: row.vessel_type,
    contract: row.contract,
    signOn: row.sign_on,
    wage: row.wage,
  };
}

function toApiApplication(row: any): Application {
  return {
    id: row.id,
    positionId: row.position_id,
    positionRole: row.position_role,
    name: row.name,
    email: row.email,
    rank: row.rank,
    submitted: row.submitted,
    status: row.status,
  };
}

// --- Positions -------------------------------------------------------

app.get("/api/positions", async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(toApiPosition));
});

// Only employers can post a vacancy.
app.post(
  "/api/positions",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { rank, role, vessel, vesselType, contract, signOn, wage } = req.body ?? {};

    if (!role || !vessel || !contract || !signOn) {
      return res.status(400).json({
        error: "role, vessel, contract, and signOn are all required.",
      });
    }
    if (!VALID_RANKS.includes(rank)) {
      return res.status(400).json({
        error: `rank must be one of: ${VALID_RANKS.join(", ")}`,
      });
    }

    const { data, error } = await supabase
      .from("positions")
      .insert({
        rank,
        role: String(role).trim(),
        vessel: String(vessel).trim(),
        vessel_type: String(vesselType || vessel).trim(),
        contract: String(contract).trim(),
        sign_on: String(signOn).trim(),
        wage: wage ? String(wage).trim() : null,
        posted_by: req.user!.id,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(toApiPosition(data));
  }
);

// --- Applications ------------------------------------------------------

// A seafarer only sees their own applications — this is now real per-user
// data, not sample data, because it's filtered by the verified token's
// user id rather than trusting anything the client claims.
app.get(
  "/api/applications",
  requireAuth("SEAFARER"),
  async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", req.user!.id)
      .order("submitted", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json((data ?? []).map(toApiApplication));
  }
);

app.post(
  "/api/applications",
  requireAuth("SEAFARER"),
  async (req: Request, res: Response) => {
    const { positionId, positionRole, name, email, rank } = req.body ?? {};

    if (!positionId || !positionRole || !name || !email || !rank) {
      return res.status(400).json({
        error: "positionId, positionRole, name, email, and rank are required.",
      });
    }
    if (!EMAIL_RE.test(String(email))) {
      return res.status(400).json({ error: "That doesn't look like a valid email." });
    }

    const { data: position } = await supabase
      .from("positions")
      .select("id")
      .eq("id", positionId)
      .maybeSingle();

    if (!position) {
      return res.status(404).json({ error: "That position no longer exists." });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        position_id: positionId,
        position_role: String(positionRole).trim(),
        user_id: req.user!.id,
        name: String(name).trim(),
        email: String(email).trim(),
        rank: String(rank),
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(toApiApplication(data));
  }
);

// --- Employer view of applicants -----------------------------------

// Employers see applicants only for positions THEY posted — enforced by
// looking up their own position ids first, never trusting a client-supplied
// employer id. Two queries, kept deliberately simple to reason about rather
// than a single clever join.
app.get(
  "/api/my-postings/applications",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { data: myPositions, error: posErr } = await supabase
      .from("positions")
      .select("id")
      .eq("posted_by", req.user!.id);

    if (posErr) return res.status(500).json({ error: posErr.message });

    const positionIds = (myPositions ?? []).map((p) => p.id);
    if (positionIds.length === 0) return res.json([]);

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .in("position_id", positionIds)
      .order("submitted", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json((data ?? []).map(toApiApplication));
  }
);

// Update an applicant's status — only if the application belongs to a
// position this employer actually posted.
app.patch(
  "/api/applications/:id/status",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { status } = req.body ?? {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const { data: application } = await supabase
      .from("applications")
      .select("id, position_id, positions!inner(posted_by)")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }
    const postedBy = (application as any).positions?.posted_by;
    if (postedBy !== req.user!.id) {
      return res.status(403).json({
        error: "You can only update applicants for positions you posted.",
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(toApiApplication(data));
  }
);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Meridian backend listening on http://localhost:${PORT}`);
});
