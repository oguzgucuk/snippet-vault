import Link from "next/link"
import { Code2, Heart, Tag, LogOut, Settings } from "lucide-react"
import { signOut } from "@/app/auth/actions"

export function Sidebar() {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-white/5 flex flex-col hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Code2 className="w-6 h-6 text-primary mr-3" />
        <span className="text-lg font-bold text-white tracking-tight">
          Snippet Vault
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20 transition-all"
        >
          <Code2 className="w-5 h-5 mr-3" />
          All Snippets
        </Link>
        <Link
          href="/dashboard/favorites"
          className="flex items-center px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Heart className="w-5 h-5 mr-3" />
          Favorites
        </Link>
        <Link
          href="/dashboard/tags"
          className="flex items-center px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Tag className="w-5 h-5 mr-3" />
          Tags
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/dashboard/settings"
          className="flex items-center px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Link>
        
        {/* Logout Form using Server Action */}
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Log Out
          </button>
        </form>
      </div>
    </div>
  )
}
