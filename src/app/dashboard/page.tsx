"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";
import { Card, Button, Input, Label } from "@/components/ui";
import {
    User2,
    BriefcaseBusiness,
    ShieldCheck,
    ArrowRight,
    Lightbulb,
    Sparkles,
    CheckCircle2,
    LockKeyhole,
    Loader2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // admin login form state
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminLoading, setAdminLoading] = useState(false);

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        async function loadUser() {
            const { data } = await supabase.auth.getUser();
            const user = data.user;
            setUser(user);

            if (user) {
                const res = await fetch("/api/me");
                const j = await res.json();
                setProfile(j.profile ?? null);
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    // Inline admin login
    const onAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdminLoading(true);
        setError(null);

        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
        });

        if (error) {
            setError("Invalid admin credentials");
            setAdminLoading(false);
            return;
        }

        // verify admin role
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data?.profile?.role !== "admin") {
            setError("Access denied: not an admin");
            await supabase.auth.signOut();
            setAdminLoading(false);
            return;
        }

        window.location.href = "/admin/analytics";
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    // user not logged in
    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-black to-black px-6 text-white">
                <Card className="max-w-lg border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-semibold">Please sign in</h1>
                    <p className="mt-2 text-zinc-300">
                        You need an account to access the dashboard.{" "}
                        <Link
                            href="/login"
                            className="text-purple-400 underline hover:text-purple-300"
                        >
                            Login
                        </Link>{" "}
                        or{" "}
                        <Link
                            href="/register"
                            className="text-purple-400 underline hover:text-purple-300"
                        >
                            Register
                        </Link>.
                    </p>

                    {/* 🔐 Inline Admin Login */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <LockKeyhole className="h-5 w-5 text-purple-400" /> Admin Login
                        </h2>
                        <form onSubmit={onAdminLogin} className="space-y-3">
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    required
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    required
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-400 text-center">{error}</p>
                            )}
                            <Button
                                type="submit"
                                loading={adminLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                                {adminLoading ? "Logging in…" : "Login as Admin"}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        );
    }

    // ✅ Normal dashboard for all roles
    const role = (profile?.role || "student") as
        | "student"
        | "company"
        | "admin";

    const allTiles = [
        {
            key: "student",
            title: "Student",
            icon: User2,
            desc: "Manage your academic profile, upload resumes, build skills, and receive AI-based internship recommendations tailored to your profile.",
            links: [
                { href: "/student/profile", label: "Edit Profile" },
                { href: "/student/browse", label: "Browse Internships" },
                { href: "/student/recommendations", label: "AI Recommendations" },
            ],
        },
        {
            key: "company",
            title: "Company",
            icon: BriefcaseBusiness,
            desc: "Build your company profile, post internships, and discover talented students through intelligent matching tools.",
            links: [
                { href: "/company/profile", label: "Company Profile" },
                { href: "/company/internships/new", label: "Post New Internship" },
                { href: "/company/matches", label: "View Matches" },
            ],
        },
        {
            key: "admin",
            title: "Admin",
            icon: ShieldCheck,
            desc: "Oversee the entire ecosystem — manage users, internships, and leverage data analytics to maintain system integrity.",
            links: [
                { href: "/admin/analytics", label: "Analytics Dashboard" },
                { href: "/admin/users", label: "User Management" },
                { href: "/admin/tools", label: "RAG Tools" },
            ],
        },
    ];

    const visibleTiles = allTiles.filter((t) => {
        if (role === "admin") return true;
        return t.key === role;
    });

    const tips = [
        {
            title: "Enhance Your Profile",
            icon: Lightbulb,
            tip: "Complete your SkillSync profile — users with full profiles are 3x more likely to receive AI internship matches.",
        },
        {
            title: "Boost Your Resume",
            icon: CheckCircle2,
            tip: "Include measurable achievements in your resume — numbers stand out more than words.",
        },
        {
            title: "AI Recommendation Insight",
            icon: Sparkles,
            tip: "AI uses your top 3 skills and recent activity to recommend the best internships for your profile.",
        },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.2),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl space-y-12">
                <section className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-semibold">
                        Welcome back,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {profile?.display_name || user.email}
            </span>
                    </h1>
                    <p className="mt-2 text-sm text-zinc-300/80">
                        Your central hub for managing internships, talent, and insights.
                    </p>
                </section>

                <section>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {visibleTiles.map((t) => {
                            const Icon = t.icon;
                            return (
                                <Card
                                    key={t.title}
                                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1 hover:border-purple-400/40"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition" />
                                    <div className="relative z-10">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-900 shadow-md">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-lg font-semibold">{t.title}</h2>
                                        </div>
                                        <p className="mb-5 text-sm text-zinc-300/90 leading-relaxed">
                                            {t.desc}
                                        </p>
                                        <div className="flex flex-col gap-2 text-sm">
                                            {t.links.map((l) => (
                                                <Link
                                                    key={l.href}
                                                    href={l.href}
                                                    className="inline-flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
                                                >
                                                    <span>{l.label}</span>
                                                    <ArrowRight className="h-4 w-4 opacity-70" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {tips.map((t, i) => {
                        const Icon = t.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl hover:border-purple-400/40 transition"
                            >
                                <div className="flex items-center gap-3 text-purple-300">
                                    <Icon className="h-5 w-5" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                                        {t.title}
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                                    {t.tip}
                                </p>
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}
