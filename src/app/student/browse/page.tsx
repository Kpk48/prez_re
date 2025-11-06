"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { Briefcase, MapPin, Laptop, Loader2, Building2, Sparkles } from "lucide-react";

export default function BrowseInternshipsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/internships/list")
            .then((r) => r.json())
            .then((d) => setItems(d ?? []))
            .finally(() => setLoading(false));
    }, []);

    const apply = async (id: string) => {
        setApplying(id);
        setMessage(null);
        const res = await fetch("/api/applications/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internship_id: id }),
        });
        const json = await res.json();
        if (!res.ok) setMessage(json.error || "Failed to apply");
        else setMessage("✅ Applied successfully!");
        setApplying(null);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            {/* Soft gradient lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.2),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Browse Internships
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Explore active internship opportunities and apply directly to your preferred companies.
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`text-sm px-4 py-3 rounded-lg border ${
                            message.includes("✅")
                                ? "text-green-400 bg-green-500/10 border-green-500/20"
                                : "text-red-400 bg-red-500/10 border-red-500/20"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-zinc-400">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <span className="ml-3 text-sm">Loading internships...</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-zinc-400">
                        <Sparkles className="h-6 w-6 text-purple-400 mb-2" />
                        <p>No internships found. Check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {items.map((i) => (
                            <Card
                                key={i.id}
                                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl transition-transform hover:-translate-y-1 hover:border-purple-400/40"
                            >
                                {/* Internship Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{i.title}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                                            <Building2 className="h-4 w-4 text-purple-400" />
                                            {i.company?.name ?? "Unknown Company"}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => apply(i.id)}
                                        disabled={applying === i.id}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/30"
                                    >
                                        {applying === i.id ? "Applying..." : "Apply"}
                                    </Button>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                                    {i.description}
                                </p>

                                {/* Details */}
                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
                    {i.is_remote ? (
                        <>
                            <Laptop className="h-3 w-3 text-purple-400" />
                            Remote
                        </>
                    ) : (
                        <>
                            <MapPin className="h-3 w-3 text-pink-400" />
                            {i.location || "Onsite"}
                        </>
                    )}
                  </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
                    <Briefcase className="h-3 w-3 text-purple-400" />
                    Openings: {i.openings ?? 1}
                  </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
