import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { internship_id, cover_letter } = await req.json();
    if (!internship_id) return NextResponse.json({ error: "internship_id required" }, { status: 400 });

    const server = await getSupabaseServer();
    const admin = getSupabaseAdmin();

    const { data: u } = await server.auth.getUser();
    const user = u.user;
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: profile } = await admin.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 400 });

    const { data: student } = await admin.from("students").select("id").eq("profile_id", profile.id).maybeSingle();
    if (!student) return NextResponse.json({ error: "student not found" }, { status: 400 });

    const { error } = await admin.from("applications").insert({ internship_id, student_id: student.id, cover_letter });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "failed" }, { status: 500 });
  }
}
