import React from "react";
import { Loader2 } from "lucide-react";

export function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur dark:border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, className = "", loading = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 outline-none ring-0 transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/30 dark:bg-zinc-900/60 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 outline-none ring-0 transition focus:border-purple-400/40 focus:ring-2 focus:ring-purple-400/30 dark:bg-zinc-900/60 ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <label className={`mb-1 block text-sm font-medium text-zinc-200 ${className}`}>{children}</label>;
}
