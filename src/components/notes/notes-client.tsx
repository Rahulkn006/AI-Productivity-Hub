"use client"

import { useState } from "react"
import { NoteEditor } from "./note-editor"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FileText, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createNote, createFolder, deleteFolder } from "@/app/actions/notes"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function NotesClient({ initialNotes, initialFolders }: { initialNotes: any[], initialFolders: any[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [folders, setFolders] = useState(initialFolders)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedNote = notes.find(n => n.id === selectedNoteId)
  
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))

  const refreshFiles = () => {
    // This is a naive refresh, ideally we'd use SWR or react-query or server action revalidation properly, but revalidatePath inside actions handles next/cache. 
    // For client side simplicity, we can do window.location.reload() or we just optimistically update. Since we want a robust UX, let's keep it simple.
    window.location.reload() 
  }

  const handleCreateNote = async () => {
    try {
      const data = await createNote("New Note")
      setNotes([data, ...notes])
      setSelectedNoteId(data.id)
      toast.success("Note created")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar */}
      <div className="w-72 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">My Notes</h2>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={handleCreateNote}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9 bg-slate-50 dark:bg-slate-800 border-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                  selectedNoteId === note.id 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{note.title || "Untitled"}</span>
              </button>
            ))}
            {filteredNotes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No notes found.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor Area */}
      <NoteEditor 
        note={selectedNote} 
        onUpdated={refreshFiles} 
        onDeleted={refreshFiles} 
      />
    </div>
  )
}
