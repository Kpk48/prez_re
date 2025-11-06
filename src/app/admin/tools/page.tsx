"use client";
import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import { Search, Sparkles, Database, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminToolsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setMessage({ type: "error", text: "Please enter a search query" });
      return;
    }

    setLoading(true);
    setMessage(null);
    setResults([]);

    try {
      const res = await fetch("/api/admin/rag-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Search failed" });
        return;
      }

      setResults(data.results || []);
      
      // Show warning or success message
      if (data.warning) {
        setMessage({ type: "error", text: data.warning });
      } else if (data.message) {
        setMessage({ type: "error", text: data.message });
      } else if (data.help) {
        setMessage({ type: "error", text: `${data.message || "No results"}. ${data.help}` });
      } else {
        setMessage({ 
          type: "success", 
          text: `Found ${data.results?.length || 0} results${data.totalEmbeddings ? ` out of ${data.totalEmbeddings} total embeddings` : ''}` 
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Search failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-black to-black px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.25),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-semibold">
            RAG{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Search Tools
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-300/80">
            Search through student resumes and internship descriptions using AI-powered semantic search.
          </p>
        </section>

        {/* Search Form */}
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
          <form onSubmit={onSearch} className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Semantic Search Query
              </Label>
              <div className="mt-2 flex gap-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Looking for React developers with 2+ years experience'"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm">
              <Database className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-300">How it works</p>
                <p className="mt-1 text-xs text-blue-200/80">
                  This tool uses AI embeddings to find semantically similar content. 
                  It searches through student resumes and internship descriptions stored in the vector database.
                </p>
              </div>
            </div>
          </form>
        </Card>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              message.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-200">
              Search Results ({results.length})
            </h2>
            {results.map((result, idx) => (
              <Card
                key={idx}
                className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-400">
                    {result.owner_type === "student_resume" ? "Student Resume" : "Internship"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Similarity: {(result.similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {result.content}
                </p>
                {result.metadata && Object.keys(result.metadata).length > 0 && (
                  <div className="mt-3 text-xs text-zinc-500">
                    {JSON.stringify(result.metadata)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && message?.type === "success" && (
          <Card className="rounded-xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-xl">
            <Search className="mx-auto h-12 w-12 text-zinc-500" />
            <p className="mt-3 text-sm text-zinc-400">
              No results found for your query. Try different keywords.
            </p>
          </Card>
        )}

        {/* Feature Status */}
        {!message && results.length === 0 && (
          <Card className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-300">AI Features Status</p>
                <p className="mt-1 text-xs text-yellow-200/80">
                  If you see errors, make sure you've:
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-yellow-200/70">
                  <li>Enabled pgvector extension in Supabase</li>
                  <li>Set GEMINI_API_KEY in .env.local</li>
                  <li>Created embeddings by saving student profiles or internships</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
