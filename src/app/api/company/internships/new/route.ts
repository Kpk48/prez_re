import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { embedText } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, is_remote = true, stipend, openings = 1 } = body;
    if (!title || !description) return NextResponse.json({ error: "title and description required" }, { status: 400 });

    const server = await getSupabaseServer();
    const admin = getSupabaseAdmin();

    // get company id for current user
    const { data: u } = await server.auth.getUser();
    const user = u.user;
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { data: profile } = await admin.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 400 });
    const { data: company } = await admin.from("companies").select("id").eq("profile_id", profile.id).maybeSingle();
    if (!company) return NextResponse.json({ error: "company not found" }, { status: 400 });

    const { data: inserted, error } = await admin
      .from("internships")
      .insert({ company_id: company.id, title, description, location, is_remote, stipend, openings })
      .select("id")
      .single();
    if (error) throw error;

    // embed description for matching
    const vectors = await embedText([description]);
    await admin.from("embeddings").insert({ owner_type: "internship", owner_id: inserted.id, content: description, embedding: vectors[0] });

    return NextResponse.json({ id: inserted.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "failed" }, { status: 500 });
  }
}
