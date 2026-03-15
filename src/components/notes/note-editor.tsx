"use client"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Save, Sparkles, RefreshCw, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { updateNote, deleteNote } from "@/app/actions/notes"
import { toast } from "sonner"

interface AiSectionProps {
  title: string
  content: string | null
  isLoading: boolean
  onRegenerate: () => void
}

function AiSection({ title, content, isLoading, onRegenerate }: AiSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!content && !isLoading) return null

  return (
    <div className="border border-indigo-200 dark:border-indigo-800/50 rounded-lg overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen) } }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-50/80 dark:bg-indigo-900/20 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-500" /> : <ChevronRight className="w-4 h-4 text-indigo-500" />}
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">{title}</span>
        </div>
        {content && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
            onClick={(e) => { e.stopPropagation(); onRegenerate() }}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        )}
      </div>
      {isOpen && (
        <div className="px-4 py-3 prose prose-sm prose-slate dark:prose-invert max-w-none bg-white/50 dark:bg-slate-900/50">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ""}</ReactMarkdown>
          )}
        </div>
      )}
    </div>
  )
}

export function NoteEditor({ note, onUpdated, onDeleted, onBack }: { note: any, onUpdated: () => void, onDeleted: () => void, onBack?: () => void }) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // AI state – separate from note content
  const [aiSummary, setAiSummary] = useState<string | null>(note?.ai_summary || null)
  const [aiBullets, setAiBullets] = useState<string | null>(note?.ai_bullets || null)
  const [aiTakeaways, setAiTakeaways] = useState<string | null>(note?.ai_takeaways || null)
  const [aiLoadingAction, setAiLoadingAction] = useState<string | null>(null)

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setContent(note.content || "")
      setAiSummary(note.ai_summary || null)
      setAiBullets(note.ai_bullets || null)
      setAiTakeaways(note.ai_takeaways || null)
      setIsEditing(false)
      setAiLoadingAction(null)
    }
  }, [note])

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-slate-400">
        <Sparkles className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
        <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300">Select a note to view or edit</h3>
        <p className="mt-2 text-sm">Or create a new note from the sidebar.</p>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateNote(note.id, { title, content })
      toast.success("Note saved")
      setIsEditing(false)
      onUpdated()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNote(note.id)
      toast.success("Note deleted")
      onDeleted()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAiAction = async (promptAction: string) => {
    if (!content.trim()) return
    setAiLoadingAction(promptAction)
    try {
      const response = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, promptAction, noteId: note.id })
      })
      if (!response.ok) throw new Error("Failed to process AI action")
      const data = await response.json()

      // Update only the relevant AI state – content remains untouched
      switch (promptAction) {
        case 'summarize':
          setAiSummary(data.result)
          break
        case 'bullets':
          setAiBullets(data.result)
          break
        case 'key_takeaways':
          setAiTakeaways(data.result)
          break
      }
      toast.success("AI finished generating")
    } catch (e: any) {
      toast.error("AI error: " + e.message)
    } finally {
      setAiLoadingAction(null)
    }
  }

  const hasAiContent = aiSummary || aiBullets || aiTakeaways || aiLoadingAction

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden h-9 w-9 -ml-2" 
            onClick={onBack}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-bold text-lg border-none focus-visible:ring-0 px-0 h-auto" placeholder="Note Title" />
          ) : (
            <h2 className="font-bold text-xl truncate">{title || "Untitled Note"}</h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit Note</Button>
          )}
          <Button size="icon" variant="ghost" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* AI Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
         <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mr-2 flex flex-shrink-0 items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Actions
         </div>
         <Button variant="outline" size="sm" className="h-7 text-xs rounded-full flex-shrink-0" onClick={() => handleAiAction("summarize")} disabled={!!aiLoadingAction}>
           {aiSummary ? "Re-summarize" : "Summarize"}
         </Button>
         <Button variant="outline" size="sm" className="h-7 text-xs rounded-full flex-shrink-0" onClick={() => handleAiAction("bullets")} disabled={!!aiLoadingAction}>
           {aiBullets ? "Re-generate Bullets" : "Bullet Points"}
         </Button>
         <Button variant="outline" size="sm" className="h-7 text-xs rounded-full flex-shrink-0" onClick={() => handleAiAction("key_takeaways")} disabled={!!aiLoadingAction}>
           {aiTakeaways ? "Re-extract Takeaways" : "Key Takeaways"}
         </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Original Note Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Original Note</div>
          {isEditing ? (
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none border-0 focus-visible:ring-0 p-0"
              placeholder="Start typing your markdown..."
            />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || "*No content*"}
            </ReactMarkdown>
          )}
        </div>

        {/* AI Results – rendered below the original content */}
        {hasAiContent && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <AiSection
              title="AI Summary"
              content={aiSummary}
              isLoading={aiLoadingAction === 'summarize'}
              onRegenerate={() => handleAiAction('summarize')}
            />
            <AiSection
              title="Bullet Points"
              content={aiBullets}
              isLoading={aiLoadingAction === 'bullets'}
              onRegenerate={() => handleAiAction('bullets')}
            />
            <AiSection
              title="Key Takeaways"
              content={aiTakeaways}
              isLoading={aiLoadingAction === 'key_takeaways'}
              onRegenerate={() => handleAiAction('key_takeaways')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
