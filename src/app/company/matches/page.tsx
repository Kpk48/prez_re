"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";

export default function CompanyMatchesPage() {
  const [mine, setMine] = useState<{ company: any; internships: any[] } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/company/internships/mine").then((r) => r.json()).then((d) => setMine(d));
  }, []);

  const loadMatches = async (internshipId: string) => {
    setSelected(internshipId);
    setLoading(true);
    const recs = await fetch(`/api/recommendations/internship?internship_id=${internshipId}`).then((r) => r.json());
    setMatches(recs ?? []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Matched Students</h1>
      {!mine ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <h2 className="mb-2 text-lg font-semibold">Your Internships</h2>
            <div className="flex flex-col gap-2">
              {mine.internships?.map((i) => (
                <button
                  key={i.id}
                  onClick={() => loadMatches(i.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 ${selected === i.id ? "border-black dark:border-white" : "border-zinc-300 dark:border-zinc-800"}`}
                >
                  <div className="font-medium">{i.title}</div>
                  <div className="text-xs text-zinc-500">{new Date(i.created_at).toLocaleString()}</div>
                </button>
              ))}
              {(!mine.internships || mine.internships.length === 0) && (
                <p className="text-sm text-zinc-500">No internships posted yet.</p>
              )}
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recommendations</h2>
              {loading && <span className="text-xs text-zinc-500">Loading…</span>}
            </div>
            <div className="flex flex-col gap-3">
              {matches.map((m) => (
                <div key={m.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{m.profile?.display_name || m.profile?.email}</div>
                    <span className="text-xs text-emerald-600">Score {(m.score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
              {!loading && selected && matches.length === 0 && (
                <p className="text-sm text-zinc-500">No matches yet. Try refining the internship description or ensure student resumes are indexed.</p>
              )}
              {!selected && (
                <p className="text-sm text-zinc-500">Select an internship to view matched students.</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
