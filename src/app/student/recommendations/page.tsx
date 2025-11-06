"use client";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";

export default function StudentRecommendationsPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const me = await fetch("/api/me").then((r) => r.json());
      const sid = me?.student_id ?? null;
      setStudentId(sid);
      if (sid) {
        const recs = await fetch(`/api/recommendations/student?student_id=${sid}`).then((r) => r.json());
        setItems(recs ?? []);
      }
      setLoading(false);
    }
    run();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Recommendations</h1>
      {loading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : studentId ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((i) => (
            <Card key={i.id}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{i.title}</h3>
                    <p className="text-xs text-zinc-500">{i.company?.name}</p>
                  </div>
                  <span className="text-xs text-emerald-600">Score {(i.score * 100).toFixed(0)}%</span>
                </div>
                <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">{i.description}</p>
                <div className="text-xs text-zinc-500">{i.is_remote ? "Remote" : i.location || "Onsite"}</div>
                <div>
                  <Button onClick={() => window.location.href = "/student/browse"}>Apply</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No student profile found. Go to your <a className="underline" href="/student/profile">profile</a> to set it up.</p>
      )}
    </div>
  );
}
