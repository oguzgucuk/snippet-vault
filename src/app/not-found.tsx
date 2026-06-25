import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10 flex flex-col items-center text-center">
        <div className="mb-8 relative">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] rounded-full p-4 border border-white/10">
            <SearchX className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Page not found</h2>
        <p className="text-gray-400 mb-8 text-lg">
          The snippet or page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link href="/">
          <Button className="h-12 px-8 glow-primary text-base font-semibold">
            Return to Safety
          </Button>
        </Link>
      </div>
    </div>
  )
}
