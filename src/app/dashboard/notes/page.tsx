import { NotesClient } from "@/components/notes/notes-client"
import { getNotes, getFolders } from "@/app/actions/notes"

export const metadata = {
  title: "Notes - AI Productivity Hub",
}

export default async function NotesPage() {
  const notes = await getNotes()
  const folders = await getFolders()

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Notes Saver
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
          Intelligently organize, write, and summarize your thoughts.
        </p>
      </div>

      <NotesClient initialNotes={notes} initialFolders={folders} />
    </div>
  )
}
