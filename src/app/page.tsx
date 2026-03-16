"use client";

import Link from "next/link";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import { Header } from "@/components/layout/header";
import { Sparkles, BrainCircuit, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { loginWithGoogle, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center relative overflow-hidden font-sans">
      <Header />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none opacity-50" />

      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 font-medium text-xs sm:text-sm tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED PRODUCTIVITY HUB</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Run your entire <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
              AI workflow
            </span> in one place
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            A polished workspace for summaries, job discovery, notes, and resume building with fast performance and focused UX.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start"
          >
            <GoogleAuthButton />
            <button 
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all font-medium text-slate-700 dark:text-slate-300 shadow-sm"
            >
              {isLoading ? "..." : "Explore Tools"} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Hero Illustration / Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="flex-1 relative w-full lg:w-auto"
        >
          <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl rounded-[40px] border border-white/40 dark:border-slate-700/40 p-1 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 pointer-events-none" />
            
            {/* Workspace Signal Design */}
            <div className="h-full w-full p-8 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Workspace Signal</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: BrainCircuit, label: "Notes Saver", color: "bg-emerald-500", href: "/dashboard/notes" },
                  { icon: Sparkles, label: "YouTube Summarizer", color: "bg-rose-500", href: "/dashboard/youtube" },
                  { icon: Rocket, label: "AI Job Search", color: "bg-blue-500", href: "/dashboard/jobs" },
                  { icon: CheckCircle2, label: "AI Resume Maker", color: "bg-indigo-500", href: "/dashboard/resume" },
                ].map((item, idx) => (
                  <Link href={item.href} key={idx}>
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + (idx * 0.1) }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group/item cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/10`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover/item:text-indigo-500 transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-3xl blur-2xl animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        </motion.div>
      </main>

      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800/50">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold dark:text-white">Smart Productivity Tools</h2>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to stay ahead in the AI age.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Smart Notes", 
              desc: "Organize thoughts with AI-generated summaries.", 
              icon: BrainCircuit, 
              color: "text-indigo-600" 
            },
            { 
              title: "YouTube Summarizer", 
              desc: "Extract transcripts and generate structured insights.", 
              icon: Sparkles, 
              color: "text-rose-600" 
            },
            { 
              title: "AI Job Search", 
              desc: "Find roles scraped and ranked for your skills.", 
              icon: Rocket, 
              color: "text-emerald-600" 
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/50 transition-all group">
              <feature.icon className={`w-10 h-10 ${feature.color} mb-6 transition-transform group-hover:scale-110`} />
              <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full py-12 px-6 border-t border-slate-200 dark:border-slate-800/50 text-center">
        <p className="text-sm text-slate-500">&copy; 2026 AI Productivity Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
