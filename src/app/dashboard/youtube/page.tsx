import { YouTubeClient } from "@/components/youtube/youtube-client"
import { getSummaries } from "@/app/actions/youtube"

export const metadata = {
  title: "YouTube Summarizer - AI Productivity Hub",
}

export default async function YouTubePage() {
  const summaries = await getSummaries()

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-500">
            YouTube Summarizer
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Extract transcripts and generate structured summaries instantly.
          </p>
        </div>
      </div>

      <YouTubeClient initialSummaries={summaries} />
    </div>
  )
}
