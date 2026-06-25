"use client"

import React from "react"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"

// Prism core is imported, now import language definitions
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-python"
import "prismjs/components/prism-css"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"

// Import a dark theme for Prism
import "prismjs/themes/prism-tomorrow.css"

interface CodeEditorProps {
  value: string
  onChange: (val: string) => void
  language: string
  name?: string
  placeholder?: string
}

export function CodeEditor({ value, onChange, language, name, placeholder }: CodeEditorProps) {
  // Map our simple language names to Prism grammar names
  const getGrammar = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "typescript": return Prism.languages.typescript
      case "javascript": return Prism.languages.javascript
      case "react": return Prism.languages.tsx // Use tsx for react
      case "python": return Prism.languages.python
      case "css": return Prism.languages.css
      case "html": return Prism.languages.html
      case "sql": return Prism.languages.sql
      case "bash": return Prism.languages.bash
      default: return Prism.languages.javascript
    }
  }

  const highlight = (code: string) => {
    const grammar = getGrammar(language)
    if (!grammar) return code // Fallback if grammar not loaded
    return Prism.highlight(code, grammar, language)
  }

  return (
    <div className="flex-1 w-full relative overflow-y-auto rounded-md bg-[#1d1f21] border border-white/5">
      <style suppressHydrationWarning>{`
        /* Overriding some prism-tomorrow styles to blend with our UI */
        code[class*="language-"], pre[class*="language-"] {
          background: transparent !important;
          text-shadow: none !important;
          font-family: var(--font-mono), Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
        }
      `}</style>
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        textareaClassName="focus:outline-none"
        placeholder={placeholder}
        className="font-mono text-sm min-h-full"
        style={{
          fontFamily: "var(--font-mono)",
          minHeight: "100%",
        }}
      />
      {/* Hidden input to allow form submission to pick up the code value */}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  )
}
