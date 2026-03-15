"use client"

import { Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TopNavClientProps {
  user: {
    avatar_url?: string;
    full_name?: string;
    email?: string;
  } | null;
  onMenuClick?: () => void;
}

export function TopNavClient({ user, onMenuClick }: TopNavClientProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 sm:px-6 backdrop-blur">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-slate-500"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 sm:text-sm shadow-none bg-transparent"
            placeholder="Search notes, jobs, summaries..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

          {/* Profile snippet */}
          <div className="flex items-center gap-x-4">
            <span className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {user?.full_name || user?.email}
            </span>
            <img
              className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800"
              src={user?.avatar_url || "https://avatar.vercel.sh/user"}
              alt="Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
