import { createClient } from "@/utils/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? {
    avatar_url: user.user_metadata.avatar_url,
    full_name: user.user_metadata.full_name,
    email: user.email
  } : null

  return (
    <DashboardShell user={userData}>
      {children}
    </DashboardShell>
  )
}
