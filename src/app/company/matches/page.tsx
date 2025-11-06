"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { Users2, Briefcase, Loader2, Sparkles, User } from "lucide-react";

export default function CompanyMatchesPage() {
    const [mine, setMine] = useState<{ company: any; internships: any[] } | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/company/internships/mine")
            .then((r) => r.json())
            .then((d) => setMine(d));
    }, []);

    const loadMatches = async (internshipId: string) => {
        setSelected(internshipId);
        setLoading(true);
        const recs = await fetch(`/api/recommendations/internship?internship_id=${internshipId}`).then((r) =>
            r.json()
        );
        setMatches(recs ?? []);
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.2),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10">
                {/* Header */}
                <section className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Matched Students
                    </h1>
                    <p className="text-sm text-zinc-400">
                        View AI-recommended students for each internship you’ve posted.
                    </p>
                </section>

                {!mine ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <p className="ml-3 text-zinc-400 text-sm">Loading your internships…</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Left Panel — Your Internships */}
                        <Card className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase className="h-5 w-5 text-purple-400" />
                                <h2 className="text-lg font-semibold">Your Internships</h2>
                            </div>

                            <div className="flex flex-col gap-3">
                                {mine.internships?.length ? (
                                    mine.internships.map((i) => (
                                        <button
                                            key={i.id}
                                            onClick={() => loadMatches(i.id)}
                                            className={`text-left rounded-xl border px-4 py-3 transition-all duration-200 ${
                                                selected === i.id
                                                    ? "border-purple-400/50 bg-gradient-to-r from-purple-600/20 to-pink-600/20 shadow-lg"
                                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="font-medium text-white">{i.title}</div>
                                            <div className="text-xs text-zinc-400 mt-1">
                                                {new Date(i.created_at).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-400">
                                        No internships posted yet.
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Right Panel — Matches */}
                        <Card className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Users2 className="h-5 w-5 text-pink-400" />
                                    <h2 className="text-lg font-semibold">Recommendations</h2>
                                </div>
                                {loading && (
                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading…
                                    </div>
                                )}
                            </div>

                            {/* Matches List */}
                            <div className="flex flex-col gap-3">
                                {matches.map((m) => (
                                    <div
                                        key={m.id}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md hover:border-purple-400/40 transition"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-full bg-white text-zinc-900">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {m.profile?.display_name || m.profile?.email}
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        Matched for: {m.profile?.role || "Student"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-xs font-semibold ${
                                                    m.score > 0.8
                                                        ? "text-green-400"
                                                        : m.score > 0.5
                                                            ? "text-yellow-400"
                                                            : "text-red-400"
                                                }`}
                                            >
                                                Score {(m.score * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty states */}
                                {!loading && selected && matches.length === 0 && (
                                    <p className="text-sm text-zinc-400 text-center py-4">
                                        No matches yet. Try refining your internship description or ensure students have uploaded resumes.
                                    </p>
                                )}

                                {!selected && (
                                    <div className="flex flex-col items-center text-zinc-400 py-6">
                                        <Sparkles className="h-6 w-6 mb-2 text-purple-400" />
                                        <p className="text-sm">Select an internship to view matched students.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
