"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateTags } from "@/lib/ai/gemini"

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

  const { error } = await supabase
    .from("snippets")
    .insert({
      user_id: user.id,
      title,
      code,
      language,
      tags,
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

  const { error } = await supabase
    .from("snippets")
    .update({
      title,
      code,
      language,
      tags,
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
