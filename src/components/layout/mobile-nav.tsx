import Link from "next/link"
import { Code2, LogOut } from "lucide-react"
import { signOut } from "@/app/auth/actions"

export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-6 z-50">
      <Link
        href="/dashboard"
        className="flex flex-col items-center justify-center text-primary gap-1"
      >
        <Code2 className="w-6 h-6" />
        <span className="text-[10px] font-medium">Vault</span>
      </Link>

      <form action={signOut}>
        <button
          type="submit"
          className="flex flex-col items-center justify-center text-gray-500 hover:text-red-400 gap-1"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Log Out</span>
        </button>
      </form>
    </div>
  )
}
