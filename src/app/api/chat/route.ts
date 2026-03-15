import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateAiResponse } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // 1. Fetch user context (recent notes, recent YouTube summaries, recent jobs)
    const [notesRes, ytRes, jobsRes] = await Promise.all([
      supabase.from('notes').select('title, content, tags').order('created_at', { ascending: false }).limit(5),
      supabase.from('youtube_summaries').select('video_title, summary').order('created_at', { ascending: false }).limit(5),
      supabase.from('job_search_history').select('query, results').order('created_at', { ascending: false }).limit(3)
    ])

    const notesContext = notesRes.data?.map(n => `Title: ${n.title}\nContent: ${n.content?.substring(0, 500)}...\nTags: ${n.tags.join(', ')}`).join('\n\n') || 'No recent notes.'
    const ytContext = ytRes.data?.map(y => `Video: ${y.video_title}\nSummary: ${y.summary?.substring(0, 500)}...`).join('\n\n') || 'No recent YouTube summaries.'
    const jobsContext = jobsRes.data?.map(j => `Search: ${j.query}\nResults: ${j.results?.length || 0} jobs found.`).join('\n\n') || 'No recent job searches.'

    // 2. Prepare system prompt with context
    const systemPrompt = `
    You are the Global AI Assistant for "AI Productivity Hub", a premium workspace application.
    You help the user manage their notes, summarize videos, and find jobs.
    
    Here is the user's recent data context to help you answer questions accurately:
    
    --- RECENT NOTES ---
    ${notesContext}
    
    --- RECENT YOUTUBE SUMMARIES ---
    ${ytContext}
    
    --- RECENT JOB SEARCHES ---
    ${jobsContext}
    
    Instructions:
    - Answer concisely and professionally.
    - If the user asks about their data, use the context provided above.
    - If you don't know the answer or the data isn't in the context, politely say so.
    - Use Markdown formatting for readability.
    `

    // Extract the latest user message
    const latestMessage = messages[messages.length - 1].content

    // Combine system prompt and user message
    const prompt = `${systemPrompt}\n\nUser Question:\n${latestMessage}`

    // 3. Generate response using OpenRouter
    const aiResponseText = await generateAiResponse(prompt)

    // Format response to match AI SDK's useChat hook expectations 
    // (since we aren't streaming, we return the text wrapped in a simple message object)
    return NextResponse.json({ 
      id: Date.now().toString(),
      role: 'assistant',
      content: aiResponseText
    })

  } catch (error: any) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
