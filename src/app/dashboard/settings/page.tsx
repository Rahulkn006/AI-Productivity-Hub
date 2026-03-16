import { createClient } from "@/utils/supabase/server"
import { SettingsClient } from "@/components/dashboard/settings-client"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? {
    avatar_url: user.user_metadata.avatar_url,
    full_name: user.user_metadata.full_name,
    email: user.email
  } : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
      </div>
      <SettingsClient user={userData} />
    </div>
  )
}
