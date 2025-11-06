"use client";
import { useEffect, useState } from "react";
import { Card, Button, Input, Label, Textarea } from "@/components/ui";

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState<number | undefined>();
  const [resumeText, setResumeText] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => {
      if (d?.profile?.display_name) setDisplayName(d.profile.display_name);
      setStudentId(d.student_id ?? null);
    });
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updates: any = {};
      if (university) updates.university = university;
      if (degree) updates.degree = degree;
      if (graduationYear) updates.graduation_year = graduationYear;
      if (studentId) {
        await fetch("/api/student/update", { method: "POST", body: JSON.stringify({ student_id: studentId, updates }), headers: { "Content-Type": "application/json" } });
      }
      if (resumeText && studentId) {
        await fetch("/api/embeddings/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner_type: "student_resume", owner_id: studentId, content: resumeText }),
        });
      }
      setMessage("Profile saved.");
    } catch (e: any) {
      setMessage(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Student Profile</h1>
      <Card>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>University</Label>
              <Input value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>
            <div>
              <Label>Degree</Label>
              <Input value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>
            <div>
              <Label>Graduation Year</Label>
              <Input type="number" value={graduationYear ?? ""} onChange={(e) => setGraduationYear(parseInt(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>Resume (paste text)</Label>
            <Textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text here to index it for AI matching" />
          </div>
          {message && <p className="text-sm text-zinc-700 dark:text-zinc-300">{message}</p>}
          <Button type="submit" loading={loading}>Save</Button>
        </form>
      </Card>
    </div>
  );
}
