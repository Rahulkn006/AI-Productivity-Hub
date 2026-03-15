"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Youtube, Sparkles, Loader2, Play, Clock, FileText, Trash2, ListChecks, Lightbulb } from "lucide-react"
import { toast } from "sonner"
import { deleteSummary, summarizeYoutube } from "@/app/actions/youtube"
import { ScrollArea } from "@/components/ui/scroll-area"

export function YouTubeClient({ initialSummaries }: { initialSummaries: any[] }) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState("")
  const [summaries, setSummaries] = useState(initialSummaries)
  const [selectedSummary, setSelectedSummary] = useState(initialSummaries[0] || null)

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setLoadingStatus("Connecting to YouTube...")

    try {
      // Small delay to show "Connecting"
      await new Promise(r => setTimeout(r, 500))

      console.log(`[YouTube] Calling capture action for URL: ${url}`)
      const response = await summarizeYoutube(url)

      if (!response.success) {
        throw new Error(response.error || 'Failed to summarize video')
      }

      const data = response.result
      console.log(`[YouTube] Received data:`, data)

      setSummaries([data, ...summaries])
      setSelectedSummary(data)
      setUrl("")
      toast.success('Successfully summarized video!')
    } catch (e: any) {
      console.error("[YouTube] Client Error:", e)
      toast.error(e.message)
      setLoadingStatus("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteSummary(id)
      const newSummaries = summaries.filter(s => s.id !== id)
      setSummaries(newSummaries)
      if (selectedSummary?.id === id) {
        setSelectedSummary(newSummaries[0] || null)
      }
      toast.success('Summary deleted')
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {/* Search Input Area */}
      <Card className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-none shadow-sm flex flex-col items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-indigo-500/10 pointer-events-none" />
        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl mb-2 shadow-sm shadow-rose-200/50 dark:shadow-none">
            <Youtube className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            Summarize any YouTube Video
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Paste a YouTube link below and our AI will extract the transcript, create a summary, and highlight the key takeaways instantly.
          </p>

          <form onSubmit={handleSummarize} className="flex flex-col gap-3 pt-2">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm border-slate-200 dark:border-slate-700"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12 px-6 gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 dark:shadow-none" disabled={isLoading || !url}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="hidden sm:inline">Summarize</span>
              </Button>
            </div>
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-rose-600 dark:text-rose-400 animate-pulse font-medium">
                <Sparkles className="w-4 h-4" />
                {loadingStatus}
              </div>
            )}
          </form>
        </div>
      </Card>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* History Sidebar */}
        <div className="w-72 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 shrink-0 hidden md:flex">
          <h3 className="font-semibold text-base mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Clock className="w-4 h-4 text-slate-400" /> Recent Summaries
          </h3>
          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-2">
              {summaries.map(summary => (
                <div
                  key={summary.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedSummary(summary)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSummary(summary) } }}
                  className={`w-full text-left p-3 rounded-xl border transition-all group cursor-pointer ${selectedSummary?.id === summary.id
                      ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                >
                  <div className="flex gap-3">
                    <img src={summary.thumbnail_url} alt={summary.video_title} className="w-16 h-10 object-cover rounded-md bg-slate-100 shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-xs font-medium truncate text-slate-900 dark:text-slate-100">
                        {summary.video_title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {new Date(summary.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {summaries.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No summaries yet.</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Selected Summary View */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-w-0">
          {selectedSummary ? (
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <div className="max-w-3xl mx-auto space-y-8 pb-10">
                {/* Video Info Header */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative group shrink-0 w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img src={selectedSummary.thumbnail_url} alt={selectedSummary.video_title} className="w-full h-full object-cover" />
                    <a href={selectedSummary.video_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white ml-1" />
                      </div>
                    </a>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">
                          {selectedSummary.video_title}
                        </h1>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            selectedSummary.transcript?.length > 1000 
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          }`}>
                            {selectedSummary.transcript?.length > 1000 ? "Full Transcript" : "Metadata Overview"}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-red-500 transition-colors" onClick={(e) => handleDelete(selectedSummary.id, e)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <a href={selectedSummary.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-full border border-rose-100 dark:border-rose-900/30">
                        <Youtube className="w-4 h-4" /> Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />

                {/* AI Content Sections */}
                <div className="space-y-10">
                  {/* Summary */}
                  <section className="space-y-4">
                    <header className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Summary</h2>
                    </header>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {selectedSummary.summary ? (
                        <div className="text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-base">
                          {selectedSummary.summary}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No summary available for this video.</p>
                      )}
                    </div>
                  </section>

                  {/* Highlights */}
                  <section className="space-y-4">
                    <header className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <ListChecks className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Key Highlights</h2>
                    </header>
                    {selectedSummary.bullet_points && selectedSummary.bullet_points.length > 0 ? (
                      <ul className="grid gap-3">
                        {selectedSummary.bullet_points.map((point: string, i: number) => (
                          <li key={i} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm shadow-sm transition-all hover:border-emerald-200 dark:hover:border-emerald-900/30">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic text-sm pl-11">No highlights available.</p>
                    )}
                  </section>

                  {/* Takeaways */}
                  <section className="space-y-4 pb-12">
                    <header className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Takeaways</h2>
                    </header>
                    {selectedSummary.key_points && selectedSummary.key_points.length > 0 ? (
                      <div className="grid gap-4">
                        {selectedSummary.key_points.map((point: string, i: number) => (
                          <div key={i} className="flex gap-5 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900/30">
                            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-sm">
                              {i + 1}
                            </div>
                            <span className="text-slate-700 dark:text-slate-100 leading-relaxed text-sm font-medium">{point}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic text-sm pl-11">No takeaways available.</p>
                    )}
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6">
                <Youtube className="w-10 h-10 text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Ready to Summarize</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Enter a YouTube URL above and let AI do the work. Your generated summaries will appear here instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
