"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2, Heart, AlignLeft } from "lucide-react"
import { AddSnippetModal } from "@/components/snippets/add-snippet-modal"
import { SnippetCard } from "@/components/snippets/snippet-card"
import { searchSemanticSnippets } from "@/app/dashboard/actions"

interface Snippet {
  id: string
  title: string
  code: string
  language: string
  tags?: string[]
  is_favorite?: boolean
}

type TabType = "all" | "favorites"

export function SnippetList({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [semanticResults, setSemanticResults] = useState<Snippet[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("all")

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchSemanticSnippets(searchQuery)
      const mappedResults = (results || []).map((res: Record<string, unknown>) => {
        const original = initialSnippets.find(s => s.id === res.id)
        return {
          ...res,
          is_favorite: original?.is_favorite
        }
      })
      setSemanticResults(mappedResults)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  // Determine which snippets to show
  let baseSnippets = semanticResults !== null ? semanticResults : initialSnippets

  // Filter by tab
  if (activeTab === "favorites") {
    baseSnippets = baseSnippets.filter(s => s.is_favorite)
  }

  // Filter by query if not using semantic search
  const displaySnippets = semanticResults !== null
    ? baseSnippets
    : baseSnippets.filter(snippet => {
        const query = searchQuery.toLowerCase()
        const matchTitle = snippet.title.toLowerCase().includes(query)
        const matchLanguage = snippet.language.toLowerCase().includes(query)
        const matchTags = snippet.tags?.some(tag => tag.toLowerCase().includes(query))
        return matchTitle || matchLanguage || matchTags
      })

  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        
        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "favorites" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heart className="w-4 h-4" fill={activeTab === "favorites" ? "currentColor" : "none"} />
            Favorites
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 w-full max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search snippets, tags, or ask AI..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (semanticResults !== null) {
                setSemanticResults(null)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                handleSemanticSearch()
              }
            }}
            className="w-full h-11 pl-10 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSemanticSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            title="AI Semantic Search"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Sparkles className="w-4 h-4" />}
          </button>
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
            You haven&apos;t added any snippets yet. Click the &quot;Add Snippet&quot; button above to store your first piece of code.
          </p>
        </div>
      ) : displaySnippets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl p-12">
          <h2 className="text-xl font-semibold text-white mb-2">No snippets found</h2>
          <p className="text-center max-w-md">
            {activeTab === "favorites" && initialSnippets.filter(s => s.is_favorite).length === 0 
              ? "You haven't favorited any snippets yet."
              : semanticResults !== null 
                ? `AI couldn't find any snippets related to: "${searchQuery}"`
                : `No snippets match your search query: "${searchQuery}"`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displaySnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </>
  )
}
