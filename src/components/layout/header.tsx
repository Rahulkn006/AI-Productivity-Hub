"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { loginWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50"
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-indigo-500/20">
            <Image
              src="/logo.png"
              alt="AI Productivity Hub Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            AI Productivity Hub
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
        <Link
          href="/"
          className="px-4 py-1.5 text-sm font-medium rounded-full bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white"
        >
          Home
        </Link>
        <button
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-4 py-1.5 text-sm font-medium rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Tools
        </button>
      </nav>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden sm:flex text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Sign in"}
        </Button>
        <Button 
          size="sm" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 shadow-lg shadow-indigo-600/20"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Get Started"}
        </Button>
      </div>
    </motion.header>
  );
}
