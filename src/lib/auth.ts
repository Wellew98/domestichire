// Auth utilities using Node.js built-in crypto (zero external deps)
import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export interface AuthPayload {
  id: number;
  email: string;
  role: "employer" | "admin";
}

function base64url(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf-8");
}

export function signToken(payload: AuthPayload): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 }));
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const [headerB64, bodyB64, sigB64] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${headerB64}.${bodyB64}`).digest("base64url");
    if (sigB64 !== expectedSig) return null;

    const payload = JSON.parse(base64urlDecode(bodyB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export async function comparePassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return computed === hash;
}

export async function getUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<AuthPayload> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(): Promise<AuthPayload> {
  const user = await requireAuth();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
