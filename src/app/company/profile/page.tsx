"use client";
import { useEffect, useState } from "react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { Building2, Globe2, FileText, Loader2, CheckCircle2 } from "lucide-react";

export default function CompanyProfilePage() {
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        fetch("/api/company/internships/mine")
            .then((r) => r.json())
            .then((d) => {
                if (d?.company) {
                    setCompanyId(d.company.id);
                    setName(d.company.name || "");
                    setWebsite(d.company.website || "");
                    setDescription(d.company.description || "");
                }
            })
            .finally(() => setInitializing(false));
    }, []);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;
        setLoading(true);
        setMessage(null);
        const res = await fetch("/api/company/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                company_id: companyId,
                updates: { name, website, description },
            }),
        });
        const json = await res.json();
        if (!res.ok) setMessage(json.error || "Failed to save");
        else setMessage("✅ Saved successfully!");
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.2),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-3xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Company Profile
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Manage your company details and keep them up to date for better visibility.
                    </p>
                </div>

                {/* Loading state */}
                {initializing ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <span className="ml-3 text-zinc-400 text-sm">Loading company profile…</span>
                    </div>
                ) : (
                    <Card className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl space-y-6">
                        <form onSubmit={onSave} className="space-y-6">
                            {/* Name */}
                            <div>
                                <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-purple-400" /> Company Name
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g., Acme Technologies Pvt Ltd"
                                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                    <Globe2 className="h-4 w-4 text-pink-400" /> Website
                                </Label>
                                <Input
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://www.company.com"
                                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-400" /> Description
                                </Label>
                                <Textarea
                                    rows={6}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your company, work culture, and focus areas..."
                                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                />
                            </div>

                            {/* Message */}
                            {message && (
                                <p
                                    className={`text-sm px-3 py-2 rounded-md ${
                                        message.includes("✅")
                                            ? "text-green-400 bg-green-500/10 border border-green-500/20"
                                            : "text-red-400 bg-red-500/10 border border-red-500/20"
                                    }`}
                                >
                                    {message}
                                </p>
                            )}

                            {/* Save Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/20"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    );
}
