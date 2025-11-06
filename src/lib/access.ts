import { getCurrentProfile } from "@/lib/current";
import type { UserRole } from "@/lib/profile";

export type Role = UserRole;

export async function getRole(): Promise<Role | null> {
    const profile = await getCurrentProfile();
    return (profile?.role as Role) ?? null;
}

export async function isRole(role: Role): Promise<boolean> {
    const r = await getRole();
    return r === role;
}

export async function requireAny(roles: Role[]): Promise<boolean> {
    const r = await getRole();
    if (!r) return false;
    return roles.includes(r);
}

export function roleForbiddenText(): string {
    return "403 — Forbidden: You do not have permission to access this section.";
}
