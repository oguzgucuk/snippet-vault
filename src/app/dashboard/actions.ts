"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateTags, generateEmbedding } from "@/lib/ai/gemini"
import { z } from "zod"

// Zod schema for snippets
const snippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  code: z.string().min(1, "Code is required").max(10000, "Code is too long"),
  language: z.enum([
    "typescript", "javascript", "react", "python", "css", "html", "sql", "bash"
  ], { message: "Unsupported language" }),
  tags: z.string().optional(),
})

export async function createSnippet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Zod Validation
  const validatedFields = snippetSchema.safeParse({
    title: formData.get("title"),
    code: formData.get("code"),
    language: formData.get("language"),
    tags: formData.get("tags"),
  })

  if (!validatedFields.success) {
    throw new Error(`Validation failed: ${validatedFields.error.message}`)
  }

  const { title, code, language, tags: tagsString } = validatedFields.data
  const autoTag = formData.get("autoTag") === "on"

  let tags: string[] = []
  if (tagsString) {
    tags = tagsString.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
  }

  if (autoTag) {
    try {
      const aiTags = await generateTags(code, language)
      tags = Array.from(new Set([...tags, ...aiTags]))
    } catch (error) {
      console.warn("AI Tagging failed, proceeding with manual tags", error)
    }
  }

  // Generate embedding for semantic search
  const textToEmbed = `Title: ${title}\nLanguage: ${language}\nTags: ${tags.join(", ")}\n\nCode:\n${code}`
  let embedding = null
  try {
    embedding = await generateEmbedding(textToEmbed)
    if (!embedding) throw new Error("Null embedding returned")
  } catch (error) {
    console.error("Embedding generation failed", error)
    throw new Error("AI embedding failed. Please try again later.")
  }

  const { error } = await supabase
    .from("snippets")
    .insert({
      user_id: user.id,
      title,
      code,
      language,
      tags,
      embedding,
    })

  if (error) {
    console.error("Error inserting snippet:", error)
    throw new Error("Failed to create snippet")
  }

  revalidatePath("/dashboard")
}

export async function deleteSnippet(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("snippets")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error("Failed to delete snippet")
  }

  revalidatePath("/dashboard")
}

export async function updateSnippet(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Zod Validation
  const validatedFields = snippetSchema.safeParse({
    title: formData.get("title"),
    code: formData.get("code"),
    language: formData.get("language"),
    tags: formData.get("tags"),
  })

  if (!validatedFields.success) {
    throw new Error(`Validation failed: ${validatedFields.error.message}`)
  }

  const { title, code, language, tags: tagsString } = validatedFields.data

  let tags: string[] = []
  if (tagsString) {
    tags = tagsString.split(",").map(t => t.trim()).filter(Boolean)
  }

  // Generate new embedding
  const textToEmbed = `Title: ${title}\nLanguage: ${language}\nTags: ${tags.join(", ")}\n\nCode:\n${code}`
  let embedding = null
  try {
    embedding = await generateEmbedding(textToEmbed)
  } catch (error) {
    console.warn("Embedding update failed, keeping old embedding", error)
  }

  // Update object construction
  const updateData: Record<string, unknown> = {
    title,
    code,
    language,
    tags,
    updated_at: new Date().toISOString(),
  }
  
  // Only update embedding if generation succeeded (Null-guard for updates)
  if (embedding) {
    updateData.embedding = embedding
  }

  const { error } = await supabase
    .from("snippets")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Error updating snippet:", error)
    throw new Error("Failed to update snippet")
  }

  revalidatePath("/dashboard")
}

export async function toggleFavoriteSnippet(id: string, isFavorite: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("snippets")
    .update({ is_favorite: isFavorite })
    .eq("id", id)

  if (error) {
    throw new Error("Failed to toggle favorite")
  }

  revalidatePath("/dashboard")
}

export async function searchSemanticSnippets(query: string) {
  if (!query || query.trim() === "") return []
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  let queryEmbedding = null
  try {
    queryEmbedding = await generateEmbedding(query)
    if (!queryEmbedding) throw new Error("Null embedding")
  } catch (error) {
    console.error("Failed to generate search embedding", error)
    throw new Error("Semantic search is temporarily unavailable")
  }

  const { data, error } = await supabase.rpc("match_snippets", {
    query_embedding: queryEmbedding,
    match_threshold: 0.1,
    match_count: 5
  })

  if (error) {
    console.error("Semantic search error:", error)
    throw new Error("Failed to perform semantic search")
  }

  return data
}
