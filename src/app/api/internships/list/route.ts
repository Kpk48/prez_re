import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supa = getSupabaseAdmin();
  const { data, error } = await supa
    .from("internships")
    .select("id, title, description, location, is_remote, stipend, openings, company:companies(name, id)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
