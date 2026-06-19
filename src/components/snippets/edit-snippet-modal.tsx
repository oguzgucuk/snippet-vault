"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSnippet } from "@/app/dashboard/actions"
import { CodeEditor } from "@/components/snippets/code-editor"

interface EditSnippetModalProps {
  snippet: {
    id: string
    title: string
    code: string
    language: string
    tags?: string[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSnippetModal({ snippet, open, onOpenChange }: EditSnippetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [code, setCode] = useState(snippet.code)
  const [language, setLanguage] = useState(snippet.language)

  // Update state if snippet changes
  useEffect(() => {
    setCode(snippet.code)
    setLanguage(snippet.language)
  }, [snippet])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      await updateSnippet(snippet.id, formData)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1400px] sm:max-w-[1400px] w-[95vw] p-0 overflow-hidden bg-[#0a0a0a] border-white/10 text-white">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-[85vh] min-h-[600px]">
          
          {/* Left Side: Code Editor (Wider) */}
          <div className="flex-1 flex flex-col p-6 border-r border-white/5 bg-[#121212]/50 overflow-hidden">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold">Edit Code</DialogTitle>
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
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  required
                  defaultValue={snippet.title}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-language">Language</Label>
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
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  defaultValue={snippet.tags?.join(", ")}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
              <Button type="submit" disabled={isSubmitting} className="w-full glow-primary">
                {isSubmitting ? "Saving..." : "Update Snippet"}
              </Button>
            </div>
          </div>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}
