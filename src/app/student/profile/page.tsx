"use client";
import { useEffect, useState } from "react";
import { Card, Button, Input, Label, Textarea } from "@/components/ui";
import { User2, GraduationCap, School, FileText, Loader2, CheckCircle2 } from "lucide-react";

export default function StudentProfilePage() {
    const [loading, setLoading] = useState(false);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [university, setUniversity] = useState("");
    const [degree, setDegree] = useState("");
    const [graduationYear, setGraduationYear] = useState<number | undefined>();
    const [resumeText, setResumeText] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        fetch("/api/me")
            .then((r) => r.json())
            .then((d) => {
                if (d?.profile?.display_name) setDisplayName(d.profile.display_name);
                setStudentId(d.student_id ?? null);
            })
            .finally(() => setInitializing(false));
    }, []);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const updates: any = {};
            if (university) updates.university = university;
            if (degree) updates.degree = degree;
            if (graduationYear) updates.graduation_year = graduationYear;
            if (studentId) {
                await fetch("/api/student/update", {
                    method: "POST",
                    body: JSON.stringify({ student_id: studentId, updates }),
                    headers: { "Content-Type": "application/json" },
                });
            }
            // Try to generate embeddings for AI matching (optional)
            if (resumeText && studentId) {
                try {
                    const embeddingRes = await fetch("/api/embeddings/ingest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            owner_type: "student_resume",
                            owner_id: studentId,
                            content: resumeText,
                        }),
                    });
                    
                    if (!embeddingRes.ok) {
                        console.warn("Failed to generate embeddings (AI features may not work):", await embeddingRes.text());
                        setMessage("✅ Profile saved! (AI features unavailable - configure GEMINI_API_KEY)");
                        return;
                    }
                } catch (embErr) {
                    // Embeddings failed but profile is saved
                    console.warn("Embeddings error:", embErr);
                    setMessage("✅ Profile saved! (AI features unavailable)");
                    return;
                }
            }
            setMessage("✅ Profile saved successfully!");
        } catch (e: any) {
            setMessage(e.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
            {/* Subtle lighting gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.2),transparent_70%)]" />

            <div className="relative z-10 mx-auto w-full max-w-3xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Student Profile
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Keep your academic profile updated and upload your resume for accurate AI internship matches.
                    </p>
                </div>

                {/* Loading state */}
                {initializing ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                        <span className="ml-3 text-zinc-400 text-sm">Loading profile…</span>
                    </div>
                ) : (
                    <Card className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl space-y-6">
                        <form onSubmit={onSave} className="space-y-6">
                            {/* Display Name */}
                            <div>
                                <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                    <User2 className="h-4 w-4 text-purple-400" /> Display Name
                                </Label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your full name"
                                    className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                />
                            </div>

                            {/* Education Section */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                        <School className="h-4 w-4 text-pink-400" /> University
                                    </Label>
                                    <Input
                                        value={university}
                                        onChange={(e) => setUniversity(e.target.value)}
                                        placeholder="e.g., IIT Madras"
                                        className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-purple-400" /> Degree
                                    </Label>
                                    <Input
                                        value={degree}
                                        onChange={(e) => setDegree(e.target.value)}
                                        placeholder="e.g., B.Tech in CSE"
                                        className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-pink-400" /> Graduation Year
                                    </Label>
                                    <Input
                                        type="number"
                                        value={graduationYear ?? ""}
                                        onChange={(e) => setGraduationYear(parseInt(e.target.value))}
                                        placeholder="e.g., 2025"
                                        className="mt-2 bg-white/10 border-white/20 text-white placeholder-zinc-400 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div>
                                <Label className="text-sm text-zinc-300 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-400" /> Resume (paste text)
                                </Label>
                                <Textarea
                                    rows={8}
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here to index it for AI matching"
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
