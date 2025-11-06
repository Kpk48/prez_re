import { GoogleGenerativeAI } from "@google/generative-ai";

const model = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";

export async function embedText(chunks: string[]): Promise<number[][]> {
  const apiKey = process.env.GEMINI_API_KEY as string;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelClient = genAI.getGenerativeModel({ model });

  const vectors: number[][] = [];
  for (const text of chunks) {
    // embedContent returns { embedding: { values: number[] } }
    const res: any = await modelClient.embedContent(text);
    const values: number[] = res?.embedding?.values ?? [];
    vectors.push(values);
  }
  return vectors;
}
