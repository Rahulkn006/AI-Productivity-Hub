import { createClient } from "@/utils/supabase/server"
import { Card } from "@/components/ui/card"
import { BookOpen, Youtube, Briefcase, Sparkles, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Dashboard - AI Productivity Hub",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch recent activity
  const [notesRes, ytRes, jobsRes] = await Promise.all([
    supabase.from('notes').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
    supabase.from('youtube_summaries').select('id, video_title, created_at').order('created_at', { ascending: false }).limit(2),
    supabase.from('job_search_history').select('id, query, created_at').order('created_at', { ascending: false }).limit(2)
  ])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {greeting()}, {user?.user_metadata.full_name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's an overview of your AI-powered workspace today.
        </p>
      </div>

      {/* Tool Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/notes">
          <Card className="p-6 hover:shadow-md transition-all group cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-indigo-500/20 transition-colors" />
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 relative z-10">Notes Saver</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 relative z-10">Organize thoughts and generate AI summaries instantly.</p>
          </Card>
        </Link>
        
        <Link href="/dashboard/youtube">
          <Card className="p-6 hover:shadow-md transition-all group cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-rose-500/20 transition-colors" />
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
              <Youtube className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 relative z-10">YouTube AI</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 relative z-10">Extract transcripts and summarize any video.</p>
          </Card>
        </Link>

        <Link href="/dashboard/jobs">
          <Card className="p-6 hover:shadow-md transition-all group cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-emerald-500/20 transition-colors" />
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 relative z-10">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 relative z-10">AI Job Search</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 relative z-10">Scrape the web and rank your best job matches.</p>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Clock className="w-5 h-5 text-slate-400" /> Recent Activity
          </h2>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-0">
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
               
               {notesRes.data?.map(note => (
                 <Link key={`note-${note.id}`} href="/dashboard/notes" className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                     <BookOpen className="w-4 h-4" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-slate-900 dark:text-slate-100 truncate">Edited Note: {note.title}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{new Date(note.created_at).toLocaleDateString()}</p>
                   </div>
                 </Link>
               ))}

               {ytRes.data?.map(yt => (
                 <Link key={`yt-${yt.id}`} href="/dashboard/youtube" className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                     <Youtube className="w-4 h-4" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-slate-900 dark:text-slate-100 truncate">Summarized: {yt.video_title}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{new Date(yt.created_at).toLocaleDateString()}</p>
                   </div>
                 </Link>
               ))}

               {jobsRes.data?.map(job => (
                 <Link key={`job-${job.id}`} href="/dashboard/jobs" className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                     <Briefcase className="w-4 h-4" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-medium text-slate-900 dark:text-slate-100 truncate">Searched: <span className="capitalize">{job.query}</span></p>
                     <p className="text-xs text-slate-500 mt-0.5">{new Date(job.created_at).toLocaleDateString()}</p>
                   </div>
                 </Link>
               ))}

               {(!notesRes.data?.length && !ytRes.data?.length && !jobsRes.data?.length) && (
                 <div className="p-8 text-center text-slate-500 text-sm">
                    No recent activity to show yet. Try creating a note or summarizing a video!
                 </div>
               )}
             </div>
          </Card>
        </div>

        {/* AI Suggestions Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-500" /> AI Suggestions
          </h2>
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
             
             <div className="space-y-4 relative z-10">
               <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                 <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                   "You haven't reviewed your recent AI Job Search for Frontend Roles. Want me to summarize the top 3?"
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/20 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                 <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                   "Your YouTube summary for 'React 19 Features' is ready to be converted into study notes."
                 </p>
               </div>
               
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center pt-2">
                 Click the Sparkle icon in the bottom right to chat with your Global Assistant.
               </p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
