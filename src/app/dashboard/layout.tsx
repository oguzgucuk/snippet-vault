import { Sidebar } from "@/components/layout/sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Protect the dashboard route
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background glow effects for the whole dashboard */}
      <div className="fixed top-0 left-1/4 w-full h-full bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      
      <Sidebar />
      
      {/* Main Content Area - Offset by sidebar width on desktop */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
