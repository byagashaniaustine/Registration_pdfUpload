import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase setup
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")?.trim();
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase URL or SERVICE ROLE KEY is missing in environment variables!");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const uploadFile = new Hono();

uploadFile.post("/", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return c.json({ error: "No file provided." }, 400);
    if (file.type !== "application/pdf") return c.json({ error: "Only PDF files are allowed." }, 400);

    const fileData = new Uint8Array(await file.arrayBuffer());
    const fileName = `pdfs/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, fileData, { contentType: "application/pdf", upsert: true });

    if (uploadError) return c.json({ error: uploadError.message }, 500);

    // getPublicUrl does NOT return an error property
    const { data } = supabase.storage.from("pdf_files").getPublicUrl(fileName);
    const fileUrl = data.publicUrl;

    if (!fileUrl) return c.json({ error: "Failed to retrieve public URL." }, 500);

    return c.json({ message: "File uploaded successfully!", fileUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return c.json({ error: message }, 500);
  }
});

export default uploadFile;
