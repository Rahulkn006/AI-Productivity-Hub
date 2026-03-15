"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getFolders() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createFolder(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('folders').insert([{ name, user_id: user.id }]).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/notes')
  return data
}

export async function deleteFolder(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('folders').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/notes')
}

export async function getNotes() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createNote(title: string, content: string = '', folder_id: string | null = null, tags: string[] = []) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.from('notes').insert([{ 
    title, content, folder_id, tags, user_id: user.id 
  }]).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/notes')
  return data
}

export async function updateNote(id: string, updates: { title?: string, content?: string, folder_id?: string | null, tags?: string[], ai_summary?: string, ai_bullets?: string, ai_takeaways?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/notes')
  return data
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/notes')
}
