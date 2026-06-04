import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  console.log(
    "CLIENT URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  console.log(
    "CLIENT KEY EXISTS:",
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log("DEPLOY TEST V2");
  console.log("CLIENT URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}