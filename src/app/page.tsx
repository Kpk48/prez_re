import Link from "next/link";
import { Briefcase, GraduationCap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-7xl py-24">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-800 to-black p-12 text-white shadow-xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <h1 className="mb-4 text-5xl font-semibold leading-tight tracking-tight">SkillSync</h1>
        <p className="mb-10 max-w-2xl text-zinc-200">An intelligent internship platform that uses Retrieval-Augmented Generation to match students to internships and companies to candidates, powered by Supabase and Next.js.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/register" className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black shadow hover:bg-zinc-100">Get Started</Link>
          <Link href="/dashboard" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-white/10">Go to Dashboard</Link>
        </div>
      </section>
      <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <div className="mb-3 inline-flex rounded-lg bg-purple-600/10 p-2 text-purple-400"><GraduationCap className="h-5 w-5" /></div>
          <h3 className="mb-2 text-lg font-semibold">Students</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Build your profile, upload resume, and get AI recommendations for best-fit internships.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <div className="mb-3 inline-flex rounded-lg bg-purple-600/10 p-2 text-purple-400"><Briefcase className="h-5 w-5" /></div>
          <h3 className="mb-2 text-lg font-semibold">Companies</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Post internships and instantly see matched student recommendations.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
          <div className="mb-3 inline-flex rounded-lg bg-purple-600/10 p-2 text-purple-400"><Shield className="h-5 w-5" /></div>
          <h3 className="mb-2 text-lg font-semibold">Admin</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Manage users, listings, and monitor analytics and match quality.</p>
        </div>
      </section>
    </div>
  );
}
