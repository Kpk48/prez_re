import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      "https://ctnnjaowvsoiwlgetbyn.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bm5qYW93dnNvaXdsZ2V0YnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTgyMDQsImV4cCI6MjA5NjAzNDIwNH0.sCOrsKGAAYnctAYkKIdMLrqA7UhSwONRgd0vrYF7OGI",
  },
  reactCompiler: true,
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;