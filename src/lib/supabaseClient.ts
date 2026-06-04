import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  console.log("BROWSER URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("BROWSER ANON:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}