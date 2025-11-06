import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const internship_id = searchParams.get("internship_id");
    const limit = Number(searchParams.get("limit") || 10);
    if (!internship_id) return NextResponse.json({ error: "internship_id required" }, { status: 400 });

    const supa = getSupabaseAdmin();
    const { data, error } = await supa.rpc("match_students_for_internship", { p_internship_id: internship_id, p_limit: limit });
    if (error) throw error;

    const ids = (data || []).map((d: any) => d.student_id);
    if (!ids.length) return NextResponse.json([]);
    const { data: students, error: sErr } = await supa
      .from("students")
      .select("id, profile:profiles(display_name, email)")
      .in("id", ids);
    if (sErr) throw sErr;

    const scoreMap = new Map<string, number>();
    for (const row of data as any[]) scoreMap.set(row.student_id, row.score);
    const response = students.map((s) => ({ ...s, score: scoreMap.get(s.id) || 0 }));

    return NextResponse.json(response.sort((a, b) => b.score - a.score));
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "failed" }, { status: 500 });
  }
}
