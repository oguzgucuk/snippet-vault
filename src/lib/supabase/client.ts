import { createBrowserClient } from "@supabase/ssr"

/**
 * Tarayıcı (client) tarafında Supabase bağlantısı.
 * React bileşenlerinde kullanılır.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
