import Link from "next/link";
import { Briefcase, GraduationCap, Shield } from "lucide-react";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black text-white px-6 py-24">
            {/* Ambient light glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.2),transparent_70%)] -z-10" />

            <div className="relative mx-auto max-w-7xl space-y-20 text-center">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl p-12 shadow-2xl">
                    {/* Glowing orbs */}
                    <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

                    <h1 className="mb-4 text-5xl font-semibold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        SkillSync
                    </h1>
                    <p className="mb-10 mx-auto max-w-2xl text-zinc-300">
                        Empowering students and companies through intelligent internship matching.
                        Built with <span className="text-purple-400 font-medium">AI, RAG</span>, and{" "}
                        <span className="text-pink-400 font-medium">Supabase</span> — delivering smarter opportunities for every profile.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/register"
                            className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-md hover:from-purple-600 hover:to-pink-600 transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/dashboard"
                            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 hover:bg-white/10 transition backdrop-blur"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </section>

                {/* FEATURE SECTION */}
                <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* STUDENTS */}
                    <Link
                        href="/register"
                        className="group relative rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-xl transition-transform hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/15"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition" />
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-xl bg-purple-600/10 p-3 text-purple-400 shadow">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Students</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Build your profile, upload resumes, and receive AI-curated internship recommendations tailored to your unique skill set.
                            </p>
                            <p className="mt-4 inline-block text-sm font-medium text-purple-400 group-hover:text-pink-400 transition">
                                Go to Student registration →
                            </p>
                        </div>
                    </Link>

                    {/* COMPANIES */}
                    <Link
                        href="/register"
                        className="group relative rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-xl transition-transform hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/15"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition" />
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-xl bg-purple-600/10 p-3 text-purple-400 shadow">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Companies</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Post internships and instantly discover students who match your needs using SkillSync’s AI-powered ranking and recommendation system.
                            </p>
                            <p className="mt-4 inline-block text-sm font-medium text-purple-400 group-hover:text-pink-400 transition">
                                Go to Company registration →
                            </p>
                        </div>
                    </Link>

                    {/* ADMIN */}
                    <Link
                        href="/admin-login"
                        className="group relative rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-xl transition-transform hover:-translate-y-1 hover:border-purple-400/30 hover:bg-white/15"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition" />
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-xl bg-purple-600/10 p-3 text-purple-400 shadow">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Admin</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Oversee user engagement, monitor analytics, and maintain high-quality matches between students and companies.
                            </p>
                            <p className="mt-4 inline-block text-sm font-medium text-purple-400 group-hover:text-pink-400 transition">
                                Go to Admin Login →
                            </p>
                        </div>
                    </Link>
                </section>
            </div>
        </div>
    );
}
