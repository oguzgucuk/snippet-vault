"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-gray-400 mb-8">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <div className="flex gap-4 w-full">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
          >
            Go Home
          </Button>
          <Button
            onClick={() => reset()}
            className="flex-1 glow-primary"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
