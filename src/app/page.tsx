import GoogleAuthButton from "@/components/auth/google-auth-button";
import { Sparkles, BrainCircuit, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>The next generation of productivity</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 dark:text-white pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500">
          AI Productivity Hub
        </h1>
        
        <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Supercharge your workflow with AI. Take smart notes, summarize videos instantly, and discover your next dream job—all in one beautiful workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-8">
          <GoogleAuthButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-20 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Notes</h3>
            <p className="text-slate-600 dark:text-slate-400">Organize your thoughts with AI-generated summaries and key takeaways.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-xl flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">YouTube Summarizer</h3>
            <p className="text-slate-600 dark:text-slate-400">Paste any link and let AI extract transcripts and generate structured insights.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Job Search</h3>
            <p className="text-slate-600 dark:text-slate-400">Find the best roles scraped from the web and ranked for your skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
