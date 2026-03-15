import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { GlobalChatAssistant } from "@/components/chat/global-chat-assistant"

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 relative">
        <TopNav />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
        <GlobalChatAssistant />
      </div>
    </div>
  )
}
