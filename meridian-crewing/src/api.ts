export type Rank = "OFFICER" | "RATING" | "CATERING";
export type ApplicationStatus = "SUBMITTED" | "SHORTLISTED" | "OFFERED" | "REJECTED";

export interface Position {
  id: string;
  rank: Rank;
  role: string;
  vessel: string;
  vesselType: string;
  contract: string;
  signOn: string;
  wage: string | null;
}

export interface Application {
  id: string;
  positionId: string;
  positionRole: string;
  name: string;
  email: string;
  rank: string;
  submitted: string;
  status: ApplicationStatus;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string | null
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...init,
    });
  } catch {
    throw new Error(
      "Can't reach the backend. Is it running? (npm run dev inside meridian-backend)"
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

// Public — no token needed, anyone can browse open positions.
export function fetchPositions(): Promise<Position[]> {
  return request<Position[]>("/api/positions");
}

// Employer-only — backend rejects this without a valid EMPLOYER token.
export function createPosition(
  input: Omit<Position, "id">,
  token: string
): Promise<Position> {
  return request<Position>(
    "/api/positions",
    { method: "POST", body: JSON.stringify(input) },
    token
  );
}

// Seafarer-only — returns just that user's own applications.
export function fetchApplications(token: string): Promise<Application[]> {
  return request<Application[]>("/api/applications", undefined, token);
}

export function createApplication(
  input: Omit<Application, "id" | "submitted" | "status">,
  token: string
): Promise<Application> {
  return request<Application>(
    "/api/applications",
    { method: "POST", body: JSON.stringify(input) },
    token
  );
}

// Employer-only — applicants for positions THEY posted.
export function fetchMyPostingApplications(token: string): Promise<Application[]> {
  return request<Application[]>("/api/my-postings/applications", undefined, token);
}

export function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  token: string
): Promise<Application> {
  return request<Application>(
    `/api/applications/${applicationId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token
  );
}
