"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopNavClient } from "@/components/dashboard/top-nav-client"
import { GlobalChatAssistant } from "@/components/chat/global-chat-assistant"

interface DashboardShellProps {
  children: React.ReactNode;
  user: any;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNavClient user={user} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
        <GlobalChatAssistant />
      </div>
    </div>
  )
}
