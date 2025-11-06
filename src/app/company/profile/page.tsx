"use client";
import { useEffect, useState } from "react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

export default function CompanyProfilePage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/company/internships/mine").then((r) => r.json()).then((d) => {
      if (d?.company) {
        setCompanyId(d.company.id);
        setName(d.company.name || "");
      }
    });
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/company/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company_id: companyId, updates: { name, website, description } }) });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || "Failed to save"); else setMessage("Saved");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Company Profile</h1>
      <Card>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {message && <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>}
          <Button type="submit" loading={loading}>Save</Button>
        </form>
      </Card>
    </div>
  );
}
