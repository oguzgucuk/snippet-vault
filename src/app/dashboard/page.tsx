import { createClient } from "@/lib/supabase/server"
import { SnippetList } from "@/components/snippets/snippet-list"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch snippets for the current user
  const { data: snippets, error } = await supabase
    .from("snippets")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          Failed to load snippets. Please try again.
        </div>
      ) : (
        <SnippetList initialSnippets={snippets || []} />
      )}
    </div>
  )
}
