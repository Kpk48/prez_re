"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import { Button } from "@/components/ui";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const s = getSupabaseBrowser();
    s.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  const logout = async () => {
    const s = getSupabaseBrowser();
    await s.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-lg font-semibold text-transparent">SkillSync</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-zinc-200 hover:text-white">Dashboard</Link>
          {userEmail ? (
            <Button onClick={logout} className="h-9 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 px-4 text-xs hover:opacity-90">Sign out</Button>
          ) : (
            <>
              <Link href="/login" className="text-zinc-200 hover:text-white">Login</Link>
              <Link href="/register" className="text-zinc-200 hover:text-white">Register</Link>
            </>
          )}
        </nav>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
    </header>
  );
}
