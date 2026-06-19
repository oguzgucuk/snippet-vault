"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { AddSnippetModal } from "@/components/snippets/add-snippet-modal"
import { SnippetCard } from "@/components/snippets/snippet-card"

interface Snippet {
  id: string
  title: string
  code: string
  language: string
  tags?: string[]
  is_favorite?: boolean
}

export function SnippetList({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSnippets = initialSnippets.filter(snippet => {
    const query = searchQuery.toLowerCase()
    const matchTitle = snippet.title.toLowerCase().includes(query)
    const matchLanguage = snippet.language.toLowerCase().includes(query)
    const matchTags = snippet.tags?.some(tag => tag.toLowerCase().includes(query))
    return matchTitle || matchLanguage || matchTags
  })

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search snippets, tags, or languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Add Button Modal */}
        <AddSnippetModal />
      </div>

      {/* Snippets Grid */}
      {initialSnippets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl p-12">
          <div className="text-6xl mb-4">🗄️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Vault is empty</h2>
          <p className="text-center max-w-md">
            You haven't added any snippets yet. Click the "Add Snippet" button above to store your first piece of code.
          </p>
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl p-12">
          <h2 className="text-xl font-semibold text-white mb-2">No snippets found</h2>
          <p className="text-center max-w-md">
            No snippets match your search query: "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </>
  )
}
