"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createSnippet } from "@/app/dashboard/actions"
import { CodeEditor } from "@/components/snippets/code-editor"

import { toast } from "sonner"

export function AddSnippetModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("typescript")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // We will use toast.promise for a beautiful loading state
    const formData = new FormData(e.currentTarget)
    
    toast.promise(createSnippet(formData), {
      loading: "Saving snippet to Vault...",
      success: () => {
        setOpen(false)
        setCode("")
        setLanguage("typescript")
        return "Snippet saved successfully!"
      },
      error: (err: any) => {
        return err.message || "Failed to save snippet"
      },
      finally: () => setIsSubmitting(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 glow-primary">
        <Plus className="w-4 h-4 mr-2" />
        Add Snippet
      </DialogTrigger>
      <DialogContent className="max-w-[1400px] sm:max-w-[1400px] w-[95vw] p-0 overflow-hidden bg-[#0a0a0a] border-white/10 text-white">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-[85vh] min-h-[600px]">
          
          {/* Left Side: Code Editor (Wider) */}
          <div className="flex-1 flex flex-col p-6 border-r border-white/5 bg-[#121212]/50 overflow-hidden">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold">New Snippet</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex">
              <CodeEditor
                name="code"
                value={code}
                onChange={setCode}
                language={language}
                placeholder="Paste your code here..."
              />
            </div>
          </div>

          {/* Right Side: Metadata (Narrower) */}
          <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#0a0a0a]">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Fetch User Data"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select name="language" required value={language} onValueChange={(val) => val && setLanguage(val)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-white/10 text-white">
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="bash">Bash</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. frontend, auth, utility"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="autoTag" name="autoTag" className="border-white/20 data-[state=checked]:bg-primary" />
                <Label htmlFor="autoTag" className="text-sm font-normal text-gray-300 cursor-pointer">
                  Auto-tag with AI 🤖
                </Label>
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full glow-primary">
                {isSubmitting ? "Saving..." : "Save Snippet"}
              </Button>
            </div>
          </div>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}
