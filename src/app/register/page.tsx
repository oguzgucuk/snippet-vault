"use client"

import { useActionState } from "react"
import { signUp } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Register Card */}
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel relative z-10 mx-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join Snippet Vault to store and manage your code.
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="developer@example.com"
              required
              disabled={isPending}
              className="bg-[#0a0a0a]/50 border-gray-800 focus-visible:ring-primary/50 text-white placeholder:text-gray-600 font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              required
              minLength={6}
              disabled={isPending}
              className="bg-[#0a0a0a]/50 border-gray-800 focus-visible:ring-primary/50 text-white placeholder:text-gray-600 font-mono"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 glow-primary text-base font-semibold transition-all mt-4"
          >
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
