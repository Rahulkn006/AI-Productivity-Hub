import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateAiResponse } from '@/lib/ai'

const COLUMN_MAP: Record<string, string> = {
  summarize: 'ai_summary',
  bullets: 'ai_bullets',
  key_takeaways: 'ai_takeaways',
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, promptAction, noteId } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'Notes content is required' }, { status: 400 })
    }

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    const column = COLUMN_MAP[promptAction]
    if (!column) {
      return NextResponse.json({ error: 'Invalid prompt action' }, { status: 400 })
    }

    let prompt = ''
    switch (promptAction) {
      case 'summarize':
        prompt = `Please provide a concise summary of the following notes:\n\n${content}`
        break
      case 'bullets':
        prompt = `Please convert the following notes into a clean, organized bulleted list:\n\n${content}`
        break
      case 'key_takeaways':
        prompt = `Please extract the 3-5 most important key takeaways from the following notes:\n\n${content}`
        break
      default:
        prompt = `Please analyze the following notes:\n\n${content}`
    }

    // Call centralized OpenRouter AI utility via lib/ai.ts 
    // Defaults to deepseek/deepseek-chat
    const text = await generateAiResponse(prompt)

    // Persist result to the dedicated column (never touch content)
    const { data: updatedNote, error } = await supabase
      .from('notes')
      .update({ [column]: text })
      .eq('id', noteId)
      .select()
      .single()

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ error: 'Failed to save AI result' }, { status: 500 })
    }

    return NextResponse.json({ result: text, note: updatedNote })
  } catch (error: any) {
    console.error("AI Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
