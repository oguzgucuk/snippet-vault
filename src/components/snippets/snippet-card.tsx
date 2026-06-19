"use client"

import { useState } from "react"
import { Copy, Edit2, Trash2, Check, Heart } from "lucide-react"
import { deleteSnippet, toggleFavoriteSnippet } from "@/app/dashboard/actions"
import { EditSnippetModal } from "@/components/snippets/edit-snippet-modal"
import Prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/components/prism-css"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/themes/prism-tomorrow.css"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Snippet {
  id: string
  title: string
  code: string
  language: string
  tags?: string[]
  is_favorite?: boolean
}

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(snippet.is_favorite || false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSnippet(snippet.id)
    } catch (error) {
      console.error("Failed to delete", error)
      setIsDeleting(false)
    }
  }

  const handleToggleFavorite = async () => {
    const newState = !isFavorite
    setIsFavorite(newState) // Optimistic update
    try {
      await toggleFavoriteSnippet(snippet.id, newState)
    } catch (error) {
      console.error("Failed to toggle favorite", error)
      setIsFavorite(!newState) // Revert on failure
    }
  }

  return (
    <>
      <div className={`glass-panel p-5 rounded-xl flex flex-col h-[280px] group transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold line-clamp-1">{snippet.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                {snippet.language}
              </span>
              {snippet.tags?.map((tag, index) => (
                <span key={`${tag}-${index}`} className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="flex-1 bg-[#1d1f21] rounded-lg p-3 border border-white/5 overflow-hidden relative">
          <style suppressHydrationWarning>{`
            /* Overriding some prism-tomorrow styles */
            .prism-preview code[class*="language-"], .prism-preview pre[class*="language-"] {
              background: transparent !important;
              text-shadow: none !important;
              font-family: var(--font-mono), Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
              margin: 0;
              padding: 0;
            }
          `}</style>
          <pre 
            className="text-sm font-mono text-gray-300 line-clamp-5 whitespace-pre-wrap break-all prism-preview"
            dangerouslySetInnerHTML={{ 
              __html: Prism.languages[snippet.language.toLowerCase()] 
                ? Prism.highlight(snippet.code, Prism.languages[snippet.language.toLowerCase()] || Prism.languages.javascript, snippet.language.toLowerCase())
                : snippet.code 
            }}
          />
          {/* Gradient fade out effect */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1d1f21] to-transparent" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-md transition-colors ${isFavorite ? "text-red-500 hover:bg-red-500/10" : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"}`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <AlertDialog>
            <AlertDialogTrigger 
              className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0a0a0a] border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. This will permanently delete your snippet "{snippet.title}" from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <EditSnippetModal 
        snippet={snippet} 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
      />
    </>
  )
}
