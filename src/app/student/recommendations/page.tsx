"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { Sparkles, Building2, MapPin, Laptop, Loader2, BrainCircuit } from "lucide-react";

export default function StudentRecommendationsPage() {
    const [studentId, setStudentId] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function run() {
            setLoading(true);
            const me = await fetch("/api/me").then((r) => r.json());
            const sid = me?.student_id ?? null;
            setStudentId(sid);
            if (sid) {
                const recs = await fetch(`/api/recommendations/student?student_id=${sid}`).then((r) =>
                    r.json()
                );
                setItems(recs ?? []);
            }
            setLoading(false);
        }
        run();
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            {/* Subtle purple-pink lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.2),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-purple-400">
                        <BrainCircuit className="h-6 w-6" />
                        <Sparkles className="h-5 w-5 text-pink-400" />
                    </div>
                    <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        AI Internship Recommendations
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Personalized internship suggestions based on your resume, skills, and profile insights.
                    </p>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <span className="ml-3 text-zinc-400 text-sm">Fetching your recommendations…</span>
                    </div>
                ) : !studentId ? (
                    <p className="text-sm text-zinc-400 text-center">
                        No student profile found. Please complete your{" "}
                        <a href="/student/profile" className="underline text-purple-400 hover:text-pink-400">
                            profile setup
                        </a>{" "}
                        to receive AI recommendations.
                    </p>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-zinc-400">
                        <Sparkles className="h-6 w-6 text-purple-400 mb-2" />
                        <p>No recommendations available yet. Try updating your resume or skills!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {items.map((i) => (
                            <Card
                                key={i.id}
                                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl transition-transform hover:-translate-y-1 hover:border-purple-400/40"
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Title and Company */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{i.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                                                <Building2 className="h-4 w-4 text-purple-400" />
                                                {i.company?.name ?? "Unknown Company"}
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold ${
                                                i.score > 0.8
                                                    ? "text-green-400"
                                                    : i.score > 0.5
                                                        ? "text-yellow-400"
                                                        : "text-red-400"
                                            }`}
                                        >
                      Score {(i.score * 100).toFixed(0)}%
                    </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                                        {i.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
                      {i.is_remote ? (
                          <>
                              <Laptop className="h-3 w-3 text-purple-400" /> Remote
                          </>
                      ) : (
                          <>
                              <MapPin className="h-3 w-3 text-pink-400" />{" "}
                              {i.location || "Onsite"}
                          </>
                      )}
                    </span>
                                    </div>

                                    {/* Apply Button */}
                                    <div className="pt-2">
                                        <Button
                                            onClick={() => (window.location.href = "/student/browse")}
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/20"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
