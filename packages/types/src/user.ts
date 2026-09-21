/**
 * User and authentication types
 */

export enum UserRole {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
  };
  expires: string;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: "oauth" | "credentials";
}

export const AUTH_PROVIDERS: AuthProvider[] = [
  { id: "google", name: "Google", type: "oauth" },
  { id: "github", name: "GitHub", type: "oauth" },
  { id: "credentials", name: "Email & Password", type: "credentials" },
];
