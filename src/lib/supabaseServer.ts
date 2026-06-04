import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("SUPABASE_URL =", url);
  console.log("SUPABASE_KEY_EXISTS =", !!key);

  if (!url || !key) {
    throw new Error(
      `Missing Supabase env vars. URL=${url} KEY_EXISTS=${!!key}`
    );
  }

  const store: any = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll?.() ?? [];
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set?.(name, value, options as CookieOptions);
          });
        } catch {}
      },
    },
  });
}