"use client";
import { useState } from "react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

export default function NewInternshipPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(true);
  const [stipend, setStipend] = useState<number | undefined>();
  const [openings, setOpenings] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/company/internships/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, location, is_remote: isRemote, stipend, openings }),
    });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || "Failed to post internship");
    else {
      setMessage("Posted successfully");
      setTitle(""); setDescription(""); setLocation(""); setIsRemote(true); setStipend(undefined); setOpenings(1);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Post New Internship</h1>
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Bangalore" />
            </div>
            <div>
              <Label>Remote</Label>
              <div className="flex items-center gap-2">
                <input id="remote" type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} />
                <label htmlFor="remote" className="text-sm">Is remote</label>
              </div>
            </div>
            <div>
              <Label>Openings</Label>
              <Input type="number" min={1} value={openings} onChange={(e) => setOpenings(parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div>
            <Label>Stipend (optional)</Label>
            <Input type="number" value={stipend ?? ""} onChange={(e) => setStipend(parseFloat(e.target.value))} />
          </div>
          {message && <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>}
          <Button type="submit" loading={loading}>Post Internship</Button>
        </form>
      </Card>
    </div>
  );
}
