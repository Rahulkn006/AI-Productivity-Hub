import { createClient } from "@/utils/supabase/server"
import { TopNavClient } from "./top-nav-client"

export async function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = user ? {
    avatar_url: user.user_metadata.avatar_url,
    full_name: user.user_metadata.full_name,
    email: user.email
  } : null

  return <TopNavClient user={userData} onMenuClick={onMenuClick} />
}
