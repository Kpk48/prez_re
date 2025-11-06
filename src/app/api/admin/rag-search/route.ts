import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { embedText } from "@/lib/embeddings";

async function requireAdmin() {
  const server = await getSupabaseServer();
  const admin = getSupabaseAdmin();
  const { data: u } = await server.auth.getUser();
  const user = u.user;
  if (!user) return false;
  const { data: profile } = await admin.from("profiles").select("role").eq("auth_user_id", user.id).maybeSingle();
  return profile?.role === "admin";
}

export async function POST(req: Request) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }
    
    const admin = getSupabaseAdmin();
    
    // First, check if any embeddings exist
    const { count, error: countError } = await admin
      .from("embeddings")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }
    
    if (count === 0) {
      return NextResponse.json({ 
        results: [],
        message: "No embeddings found in database. Students need to save their profiles with resume text to create embeddings.",
        help: "Have students go to /student/profile and add resume text, then click save."
      });
    }
    
    // Check if GEMINI_API_KEY is configured
    if (!process.env.GEMINI_API_KEY) {
      // Return all embeddings without semantic search
      const { data: allData, error: allError } = await admin
        .from("embeddings")
        .select("*")
        .limit(10);
      
      return NextResponse.json({ 
        results: allData || [],
        warning: "Showing all embeddings (semantic search unavailable - GEMINI_API_KEY not configured)",
        count: count
      });
    }
    
    // Generate embedding for the query
    try {
      const vectors = await embedText([query]);
      const queryEmbedding = vectors[0];
      
      // Try to use the match_embeddings function
      const { data, error } = await admin.rpc('match_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: 10
      });
      
      if (error) {
        // If RPC function doesn't exist, show all embeddings
        console.warn("match_embeddings RPC not found:", error.message);
        const { data: fallbackData, error: fallbackError } = await admin
          .from("embeddings")
          .select("*")
          .limit(10);
        
        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 });
        }
        
        return NextResponse.json({ 
          results: fallbackData || [],
          warning: `Semantic search unavailable (RPC function error). Showing all ${count} embeddings. Run SEMANTIC_SEARCH_FUNCTION.sql in Supabase.`,
          totalEmbeddings: count
        });
      }
      
      return NextResponse.json({ 
        results: data || [],
        totalEmbeddings: count,
        searchQuery: query
      });
    } catch (embedError: any) {
      console.error("Embedding generation error:", embedError);
      // Show all embeddings if embedding fails
      const { data: fallbackData } = await admin
        .from("embeddings")
        .select("*")
        .limit(10);
      
      return NextResponse.json({ 
        results: fallbackData || [],
        warning: `Embedding generation failed: ${embedError.message}. Showing all embeddings.`,
        totalEmbeddings: count
      });
    }
  } catch (err: any) {
    console.error("RAG search error:", err);
    return NextResponse.json({ 
      error: err.message || "Search failed" 
    }, { status: 500 });
  }
}
