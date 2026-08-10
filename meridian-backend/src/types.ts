export type Rank = "OFFICER" | "RATING" | "CATERING";
export type UserRole = "SEAFARER" | "EMPLOYER";
export type ApplicationStatus = "SUBMITTED" | "SHORTLISTED" | "OFFERED" | "REJECTED";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

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
