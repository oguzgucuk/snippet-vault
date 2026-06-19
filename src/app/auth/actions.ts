"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/**
 * Kayıt ol
 * Kullanıcı kayıt formunu gönderdiğinde bu fonksiyon çalışır.
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect("/register?error=" + encodeURIComponent(error.message))
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

/**
 * Giriş yap
 * Kullanıcı giriş formunu gönderdiğinde bu fonksiyon çalışır.
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message))
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

/**
 * Çıkış yap
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
