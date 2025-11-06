"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import { Button } from "@/components/ui";
import { User2, Briefcase, Shield, LayoutDashboard } from "lucide-react";

export default function Header() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const s = getSupabaseBrowser();
        s.auth.getUser().then(async ({ data }) => {
            const user = data.user;
            setUserEmail(user?.email ?? null);
            if (user) {
                const res = await fetch("/api/me").then((r) => r.json());
                setRole(res?.profile?.role ?? null);
            }
            setRoleLoading(false);
        });
    }, []);

    const logout = async () => {
        const s = getSupabaseBrowser();
        await s.auth.signOut();
        window.location.href = "/";
    };

    // Dynamic links per role
    const getNavLinks = () => {
        if (!role) return [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];
        switch (role) {
            case "student":
                return [
                    { href: "/student/profile", label: "Profile", icon: User2 },
                    { href: "/student/browse", label: "Browse", icon: Briefcase },
                    { href: "/student/recommendations", label: "AI Recs", icon: Shield },
                ];
            case "company":
                return [
                    { href: "/company/profile", label: "Company", icon: Briefcase },
                    { href: "/company/internships/new", label: "Post", icon: LayoutDashboard },
                    { href: "/company/matches", label: "Matches", icon: Shield },
                ];
            case "admin":
                return [
                    { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard },
                    { href: "/admin/users", label: "Users", icon: User2 },
                    { href: "/admin/data", label: "Data", icon: Briefcase },
                    { href: "/admin/tools", label: "RAG Tools", icon: Shield },
                ];
            default:
                return [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/30 backdrop-blur-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-90 transition"
                >
                    SkillSync
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6 text-sm">
                    {userEmail ? (
                        <>
                            {!roleLoading && getNavLinks().map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-2 text-zinc-300 hover:text-white transition"
                                    >
                                        <Icon className="h-4 w-4 text-purple-400" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Button
                                onClick={logout}
                                className="h-9 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 text-xs hover:from-purple-600 hover:to-pink-700 transition shadow-sm shadow-purple-500/30"
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-zinc-300 hover:text-white transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-zinc-300 hover:text-white transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Gradient Divider */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
        </header>
    );
}
