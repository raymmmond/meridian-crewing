import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";
import { supabase } from "./supabaseClient";
import { requireAuth } from "./auth-middleware";
import {
  generalLimiter,
  applyLimiter,
  postVacancyLimiter,
  uploadLimiter,
} from "./rate-limit";
import { Position, Application, Rank, ApplicationStatus, Document, EmployerProfile } from "./types";

const app = express();
app.set("trust proxy", 1); // Render sits behind a proxy — without this, every request looks like it's from the same IP

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://meridian-crewing.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // No origin at all means a server-to-server request or a tool like
      // curl — not a browser, so the origin check doesn't apply to it.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(generalLimiter);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — matches the Supabase bucket limit
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, JPEG, or PNG files are allowed."));
  },
});

const VALID_RANKS: Rank[] = [
  "DECK_OFFICER",
  "ENGINE_OFFICER",
  "ELECTRO_TECHNICAL",
  "DECK_RATING",
  "ENGINE_RATING",
  "CATERING",
];
const VALID_STATUSES: ApplicationStatus[] = ["SUBMITTED", "SHORTLISTED", "OFFERED", "REJECTED"];
const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Maps our camelCase API shape to Postgres' snake_case columns, and back.
function toApiPosition(row: any, employer: EmployerProfile | null = null): Position {
  return {
    id: row.id,
    rank: row.rank,
    role: row.role,
    vessel: row.vessel,
    vesselType: row.vessel_type,
    contract: row.contract,
    signOn: row.sign_on,
    wage: row.wage,
    wageMin: row.wage_min,
    contractMonths: row.contract_months,
    employer,
    filled: row.filled ?? false,
  };
}

function toApiEmployerProfile(row: any): EmployerProfile {
  return {
    companyName: row.company_name,
    licenseNumber: row.license_number,
    licenseCountry: row.license_country,
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
    .eq("filled", false)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = data ?? [];
  const postedByIds = [...new Set(rows.map((r) => r.posted_by).filter(Boolean))];

  let employerByUserId: Record<string, EmployerProfile> = {};
  if (postedByIds.length > 0) {
    const { data: profiles } = await supabase
      .from("employer_profiles")
      .select("*")
      .in("user_id", postedByIds);
    for (const p of profiles ?? []) {
      employerByUserId[p.user_id] = toApiEmployerProfile(p);
    }
  }

  res.json(rows.map((row) => toApiPosition(row, employerByUserId[row.posted_by] ?? null)));
});

// Only employers can post a vacancy.
app.post(
  "/api/positions",
  requireAuth("EMPLOYER"),
  postVacancyLimiter,
  async (req: Request, res: Response) => {
    const { rank, role, vessel, vesselType, contract, signOn, wage, wageMin, contractMonths } =
      req.body ?? {};

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

    let parsedWageMin: number | null = null;
    if (wageMin !== undefined && wageMin !== null && wageMin !== "") {
      parsedWageMin = Number(wageMin);
      if (!Number.isFinite(parsedWageMin) || parsedWageMin < 0) {
        return res.status(400).json({ error: "wageMin must be a positive number." });
      }
    }

    let parsedContractMonths: number | null = null;
    if (contractMonths !== undefined && contractMonths !== null && contractMonths !== "") {
      parsedContractMonths = Number(contractMonths);
      if (!Number.isInteger(parsedContractMonths) || parsedContractMonths < 1) {
        return res.status(400).json({ error: "contractMonths must be a whole number of months." });
      }
    }

    // No anonymous postings — an employer must set a company name on their
    // profile before their first vacancy goes live. This is the actual
    // accountability mechanism: it's self-reported, not independently
    // verified, but it's no longer optional or missing entirely.
    const { data: employerProfile } = await supabase
      .from("employer_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .maybeSingle();

    if (!employerProfile || !employerProfile.company_name) {
      return res.status(400).json({
        error:
          "Set your company name in your employer profile before posting a vacancy.",
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
        wage_min: parsedWageMin,
        contract_months: parsedContractMonths,
        posted_by: req.user!.id,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(toApiPosition(data, toApiEmployerProfile(employerProfile)));
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
  applyLimiter,
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

// --- Employer's own postings (manage, not just view applicants) -------

// Everything this employer has posted, filled or not — unlike the public
// GET /api/positions, which hides filled ones.
app.get(
  "/api/my-postings",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .eq("posted_by", req.user!.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json((data ?? []).map((row) => toApiPosition(row, null)));
  }
);

app.patch(
  "/api/positions/:id/filled",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { filled } = req.body ?? {};
    if (typeof filled !== "boolean") {
      return res.status(400).json({ error: "filled must be true or false." });
    }

    const { data: existing } = await supabase
      .from("positions")
      .select("id, posted_by")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!existing || existing.posted_by !== req.user!.id) {
      return res.status(404).json({ error: "Position not found." });
    }

    const { data, error } = await supabase
      .from("positions")
      .update({ filled })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(toApiPosition(data, null));
  }
);

// Deleting is blocked if real applications exist — a seafarer's
// application history shouldn't vanish because an employer cleaned up a
// posting. Marking it filled is the correct move in that case instead.
app.delete(
  "/api/positions/:id",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { data: existing } = await supabase
      .from("positions")
      .select("id, posted_by")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!existing || existing.posted_by !== req.user!.id) {
      return res.status(404).json({ error: "Position not found." });
    }

    const { count } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("position_id", req.params.id);

    if (count && count > 0) {
      return res.status(400).json({
        error: `This position has ${count} application(s) — mark it as filled instead of deleting, so applicants aren't lost.`,
      });
    }

    const { error } = await supabase.from("positions").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  }
);

// --- Employer profile (self-reported company/license info) ------------

app.get(
  "/api/employer-profile",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("employer_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? toApiEmployerProfile(data) : null);
  }
);

app.put(
  "/api/employer-profile",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { companyName, licenseNumber, licenseCountry } = req.body ?? {};

    if (!companyName || !String(companyName).trim()) {
      return res.status(400).json({ error: "Company name is required." });
    }

    const { data, error } = await supabase
      .from("employer_profiles")
      .upsert({
        user_id: req.user!.id,
        company_name: String(companyName).trim(),
        license_number: licenseNumber ? String(licenseNumber).trim() : null,
        license_country: licenseCountry ? String(licenseCountry).trim() : null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(toApiEmployerProfile(data));
  }
);

// A seafarer withdraws their own application — checked against ownership,
// not just trusted from the client.
app.delete(
  "/api/applications/:id",
  requireAuth("SEAFARER"),
  async (req: Request, res: Response) => {
    const { data: existing } = await supabase
      .from("applications")
      .select("id, user_id")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!existing || existing.user_id !== req.user!.id) {
      return res.status(404).json({ error: "Application not found." });
    }

    const { error } = await supabase.from("applications").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
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

// --- Documents -----------------------------------------------------

const DOC_BUCKET = "documents";
const SIGNED_URL_TTL = 300; // 5 minutes — short-lived, regenerated per request

async function toApiDocument(row: any): Promise<Document> {
  const { data } = await supabase.storage
    .from(DOC_BUCKET)
    .createSignedUrl(row.file_path, SIGNED_URL_TTL);

  return {
    id: row.id,
    label: row.label,
    fileSize: row.file_size,
    uploadedAt: row.uploaded_at,
    url: data?.signedUrl ?? "",
  };
}

// A seafarer uploads their own document.
app.post(
  "/api/documents",
  requireAuth("SEAFARER"),
  uploadLimiter,
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    const label = req.body?.label;

    if (!file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }
    if (!label || !String(label).trim()) {
      return res.status(400).json({ error: "A label is required (e.g. 'STCW Certificate')." });
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${req.user!.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(DOC_BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: req.user!.id,
        label: String(label).trim(),
        file_path: filePath,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) {
      // Clean up the orphaned storage file if the database insert failed —
      // otherwise we'd have a file with no record pointing at it.
      await supabase.storage.from(DOC_BUCKET).remove([filePath]);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(await toApiDocument(data));
  }
);

// A seafarer sees their own documents.
app.get(
  "/api/documents",
  requireAuth("SEAFARER"),
  async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", req.user!.id)
      .order("uploaded_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(await Promise.all((data ?? []).map(toApiDocument)));
  }
);

// A seafarer deletes their own document.
app.delete(
  "/api/documents/:id",
  requireAuth("SEAFARER"),
  async (req: Request, res: Response) => {
    const { data: doc } = await supabase
      .from("documents")
      .select("id, user_id, file_path")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!doc || doc.user_id !== req.user!.id) {
      return res.status(404).json({ error: "Document not found." });
    }

    await supabase.storage.from(DOC_BUCKET).remove([doc.file_path]);
    const { error } = await supabase.from("documents").delete().eq("id", doc.id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  }
);

// An employer views documents for a seafarer who applied to one of THEIR
// postings — never a seafarer's documents in general, only in the context
// of a real application to a real position this employer owns.
app.get(
  "/api/applications/:id/documents",
  requireAuth("EMPLOYER"),
  async (req: Request, res: Response) => {
    const { data: application } = await supabase
      .from("applications")
      .select("id, user_id, position_id, positions!inner(posted_by)")
      .eq("id", req.params.id)
      .maybeSingle();

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }
    const postedBy = (application as any).positions?.posted_by;
    if (postedBy !== req.user!.id) {
      return res.status(403).json({
        error: "You can only view documents for applicants to positions you posted.",
      });
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", (application as any).user_id)
      .order("uploaded_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(await Promise.all((data ?? []).map(toApiDocument)));
  }
);

// --- Account deletion --------------------------------------------------

// No DB-level cascade delete is set up between these tables, so this does
// the cleanup manually, in dependency order, before removing the auth
// account itself. If any step fails partway, the account isn't deleted —
// better to leave orphaned data needing a manual look than to half-delete
// someone's account.
app.delete("/api/account", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // 1. Documents — remove the actual storage files, then the DB rows.
  const { data: docs } = await supabase
    .from("documents")
    .select("id, file_path")
    .eq("user_id", userId);

  if (docs && docs.length > 0) {
    await supabase.storage.from(DOC_BUCKET).remove(docs.map((d) => d.file_path));
    const { error: docError } = await supabase.from("documents").delete().eq("user_id", userId);
    if (docError) return res.status(500).json({ error: `Failed deleting documents: ${docError.message}` });
  }

  // 2. Positions this user posted (if an employer) — delete their
  // applications first, since applications reference position_id.
  const { data: ownedPositions } = await supabase
    .from("positions")
    .select("id")
    .eq("posted_by", userId);

  const ownedPositionIds = (ownedPositions ?? []).map((p) => p.id);
  if (ownedPositionIds.length > 0) {
    const { error: appError } = await supabase
      .from("applications")
      .delete()
      .in("position_id", ownedPositionIds);
    if (appError) return res.status(500).json({ error: `Failed deleting applications: ${appError.message}` });

    const { error: posError } = await supabase.from("positions").delete().eq("posted_by", userId);
    if (posError) return res.status(500).json({ error: `Failed deleting positions: ${posError.message}` });
  }

  // 3. This user's own applications (if a seafarer).
  const { error: ownAppError } = await supabase.from("applications").delete().eq("user_id", userId);
  if (ownAppError) return res.status(500).json({ error: `Failed deleting your applications: ${ownAppError.message}` });

  // 4. Employer profile, if any.
  const { error: profileError } = await supabase.from("employer_profiles").delete().eq("user_id", userId);
  if (profileError) return res.status(500).json({ error: `Failed deleting employer profile: ${profileError.message}` });

  // 5. Finally, the actual account — this requires the admin API, which
  // only the service_role key (never exposed to the frontend) can call.
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) return res.status(500).json({ error: `Failed deleting account: ${authError.message}` });

  res.status(204).send();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Multer throws before our route handlers run for file-size/type problems —
// without this, those would surface as an unhandled 500 instead of a clear
// message the frontend can actually show someone.
app.use((err: any, _req: Request, res: Response, next: (e?: any) => void) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Max size is 10MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || "Upload failed." });
  }
  next();
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Meridian backend listening on http://localhost:${PORT}`);
});
