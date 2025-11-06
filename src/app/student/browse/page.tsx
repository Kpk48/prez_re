"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";

export default function BrowseInternshipsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/internships/list").then((r) => r.json()).then((d) => setItems(d ?? [])).finally(() => setLoading(false));
  }, []);

  const apply = async (id: string) => {
    setApplying(id);
    setMessage(null);
    const res = await fetch("/api/applications/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internship_id: id }) });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || "Failed to apply"); else setMessage("Applied successfully");
    setApplying(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Browse Internships</h1>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      {loading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((i) => (
            <Card key={i.id}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{i.title}</h3>
                    <p className="text-xs text-zinc-500">{i.company?.name}</p>
                  </div>
                  <Button onClick={() => apply(i.id)} loading={applying === i.id}>Apply</Button>
                </div>
                <p className="line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">{i.description}</p>
                <div className="text-xs text-zinc-500">{i.is_remote ? "Remote" : i.location || "Onsite"} · Openings: {i.openings ?? 1}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
