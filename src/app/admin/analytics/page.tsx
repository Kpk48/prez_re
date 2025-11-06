"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Users, Briefcase, FileText, AlertCircle } from "lucide-react";

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/analytics")
            .then(async (r) => {
                const j = await r.json();
                if (!r.ok) setError(j.error || "Failed to load analytics");
                else setData(j);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10">
                {/* Header */}
                <section>
                    <h1 className="text-3xl font-semibold">
                        Admin{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Analytics
            </span>
                    </h1>
                    <p className="mt-2 text-sm text-zinc-300/80">
                        Real-time insights into total users, internships, and applications.
                    </p>
                </section>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                {/* Stats Grid */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1 hover:border-purple-400/40">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-purple-400 font-medium">Total Users</span>
                            <Users className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="text-3xl font-semibold">
                            {loading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-white/20" />
                            ) : (
                                data?.total_users ?? "–"
                            )}
                        </div>
                    </Card>

                    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1 hover:border-purple-400/40">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-pink-400 font-medium">Total Internships</span>
                            <Briefcase className="h-5 w-5 text-pink-400" />
                        </div>
                        <div className="text-3xl font-semibold">
                            {loading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-white/20" />
                            ) : (
                                data?.total_internships ?? "–"
                            )}
                        </div>
                    </Card>

                    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-transform hover:-translate-y-1 hover:border-purple-400/40">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-indigo-400 font-medium">Total Applications</span>
                            <FileText className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div className="text-3xl font-semibold">
                            {loading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-white/20" />
                            ) : (
                                data?.total_applications ?? "–"
                            )}
                        </div>
                    </Card>
                </section>

                {/* Footer Note */}
                <p className="text-sm text-zinc-400/80">
                    More analytics (top skills, match accuracy, and activity trends) can be added later as materialized views or dashboard charts.
                </p>
            </div>
        </div>
    );
}
