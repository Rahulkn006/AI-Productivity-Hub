"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getJobSearchHistory() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('job_search_history').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function deleteJobSearch(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('job_search_history').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/jobs')
}
