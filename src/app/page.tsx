import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Code2, Search, Lock, ArrowRight, Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            Snippet<span className="text-primary">Vault</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="glow-primary text-sm font-semibold h-9 px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Snippet Manager</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Stop organizing. <br className="hidden sm:block" /> Start finding.
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            Let AI tag and organize your code. Just drop your snippets, forget them, and search in natural language to find exactly what you need in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
            <Link href="/register">
              <Button className="h-12 px-8 glow-primary text-base font-semibold rounded-full group">
                Start Vaulting Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-12 px-8 rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-base">
                <Terminal className="w-5 h-5 mr-2" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[64px] group-hover:bg-primary/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Syntax Highlighting</h3>
            <p className="text-gray-400 leading-relaxed">
              Beautiful code previews with Prism.js. Supports over 10+ programming languages out of the box with auto-formatting.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden md:-translate-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[64px] group-hover:bg-blue-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 text-blue-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Semantic AI Search</h3>
            <p className="text-gray-400 leading-relaxed">
              Don't remember the exact title? Just ask AI. We use Google Gemini to understand the meaning of your search query.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[64px] group-hover:bg-emerald-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-6 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-400 leading-relaxed">
              Protected by Supabase Row Level Security. Your snippets are encrypted and strictly visible only to you.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-gray-300">
            <Code2 className="w-5 h-5 text-primary" />
            SnippetVault
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Snippet Vault. Built for developers.
          </p>
        </div>
      </footer>
    </div>
  )
}
