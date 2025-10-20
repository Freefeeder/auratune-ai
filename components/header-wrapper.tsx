import { createClient } from "@/lib/supabase/server"
import { HeaderClient } from "./header-client"

export async function HeaderWrapper() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <HeaderClient user={user} />
}
