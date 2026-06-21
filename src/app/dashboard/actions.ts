"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateTags, generateEmbedding } from "@/lib/ai/gemini"

export async function createSnippet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const code = formData.get("code") as string
  const language = formData.get("language") as string
  const tagsString = formData.get("tags") as string
  const autoTag = formData.get("autoTag") === "on" // "on" is the value for checked checkbox

  if (!title || !code || !language) {
    throw new Error("Missing required fields")
  }

  let tags: string[] = []
  if (tagsString) {
    tags = tagsString.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
  }

  if (autoTag) {
    const aiTags = await generateTags(code, language)
    // Merge manual and AI tags, ensuring uniqueness using Set
    tags = Array.from(new Set([...tags, ...aiTags]))
  }

  // Generate embedding for semantic search
  const textToEmbed = `Title: ${title}\nLanguage: ${language}\nTags: ${tags.join(", ")}\n\nCode:\n${code}`
  const embedding = await generateEmbedding(textToEmbed)

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

  const title = formData.get("title") as string
  const code = formData.get("code") as string
  const language = formData.get("language") as string
  const tagsString = formData.get("tags") as string

  if (!title || !code || !language) {
    throw new Error("Missing required fields")
  }

  let tags: string[] = []
  if (tagsString) {
    tags = tagsString.split(",").map(t => t.trim()).filter(Boolean)
  }

  // Generate new embedding
  const textToEmbed = `Title: ${title}\nLanguage: ${language}\nTags: ${tags.join(", ")}\n\nCode:\n${code}`
  const embedding = await generateEmbedding(textToEmbed)

  const { error } = await supabase
    .from("snippets")
    .update({
      title,
      code,
      language,
      tags,
      embedding,
      updated_at: new Date().toISOString(),
    })
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query)
  if (!queryEmbedding) {
    throw new Error("Failed to generate embedding for query")
  }

  // Call the match_snippets RPC function we created in Supabase
  const { data, error } = await supabase.rpc("match_snippets", {
    query_embedding: queryEmbedding,
    match_threshold: 0.1, // Lower threshold to find more results
    match_count: 5 // Return top 5 best matches
  })

  if (error) {
    console.error("Semantic search error:", error)
    throw new Error("Failed to perform semantic search")
  }

  return data
}
