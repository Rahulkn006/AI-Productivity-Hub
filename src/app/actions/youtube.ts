"use server"

import { YoutubeTranscript } from "youtube-transcript"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"


export async function getSummaries() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('youtube_summaries').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSummary(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('youtube_summaries').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/youtube')
}

// Function to extract basic YouTube metadata from HTML 
// since YouTube Transcript API only gives the text
export async function getYoutubeMetadata(videoId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      }
    })
    const html = await res.text()

    // Try multiple title patterns
    const titleMatch =
      html.match(/<meta\s+name="title"\s+content="([^"]*)"/i) ||
      html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i) ||
      html.match(/<title>(.*?)<\/title>/i)

    let title = titleMatch ? titleMatch[1].replace(' - YouTube', '').trim() : 'YouTube Video'

    // Use hqdefault as it's the most reliable across all videos
    return {
      title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
  } catch (e) {
    return { title: 'YouTube Video', thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }
  }
}
// Full robust YouTube summarization pipeline
export async function summarizeYoutube(url: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      throw new Error("Unauthorized")
    }

    if (!url) {
      throw new Error("YouTube URL is required")
    }

    // 1. Extract video ID
    console.log(`[YouTube] Starting pipeline for URL: ${url}`)
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/)
    if (!videoIdMatch) throw new Error("Invalid YouTube URL")
    const videoId = videoIdMatch[1]
    
    // 2. Get metadata
    const metadata = await getYoutubeMetadata(videoId)
    console.log(`[YouTube] Metadata fetched: ${metadata.title}`)

    // 3. Fetch transcript
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
    const fullTranscript = transcriptData.map((t) => t.text).join(" ")
    
    if (!fullTranscript) {
      throw new Error("This video does not provide captions, so it cannot be summarized.")
    }
    console.log(`[YouTube] Transcript length: ${fullTranscript.length}`)

    // 4. Chunk transcript for long videos (max 4000 chars per chunk)
    const { chunkText } = require("@/lib/chunk-text")
    const chunks = chunkText(fullTranscript, 4000)
    let summaryResult = ""

    // Prompt context is more reliable when defined here
    const jsonFormat = `{
      "summary": "detailed paragraph overview",
      "bullet_points": ["point 1", "point 2", ...],
      "key_points": ["takeaway 1", "takeaway 2", ...]
    }`

    if (chunks.length === 1) {
      const prompt = `Analyze this YouTube transcript and return JSON only: ${jsonFormat}\n\nTranscript: ${chunks[0]}`
      summaryResult = await callAI(prompt)
    } else {
      console.log(`[YouTube] Processing ${chunks.length} chunks...`)
      const chunkSummaries = []
      for (let i = 0; i < chunks.length; i++) {
        const chunkPrompt = `Summarize this section of a YouTube video transcript concisely:\n\n${chunks[i]}`
        chunkSummaries.push(await callAI(chunkPrompt))
      }

      const finalPrompt = `Merge these partial summaries into a final JSON report: ${jsonFormat}\n\nPartial summaries: ${chunkSummaries.join("\n\n")}`
      summaryResult = await callAI(finalPrompt)
    }

    // 5. Parse JSON safely
    let aiResult
    try {
      const jsonStr = summaryResult.substring(summaryResult.indexOf('{'), summaryResult.lastIndexOf('}') + 1)
      const parsed = JSON.parse(jsonStr)
      aiResult = {
        summary: parsed.summary || parsed.overview || parsed.detailed_summary || "",
        bullet_points: parsed.bullet_points || parsed.highlights || parsed.points || [],
        key_points: parsed.key_points || parsed.takeaways || parsed.key_takeaways || []
      }
    } catch (e) {
      console.error("Failed to parse AI response as JSON", summaryResult)
      throw new Error("AI failed to generate structural format. Please try again.")
    }

    // 6. Save to Database
    console.log("[YouTube] Saving summary to Supabase")
    const { data, error: dbError } = await supabase.from('youtube_summaries').insert([{
      user_id: user.id,
      video_url: url,
      video_id: videoId,
      video_title: metadata?.title || 'YouTube Video',
      thumbnail_url: metadata?.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      transcript: fullTranscript,
      summary: aiResult.summary,
      bullet_points: aiResult.bullet_points,
      key_points: aiResult.key_points,
      created_at: new Date().toISOString()
    }]).select().single()

    if (dbError) throw new Error(`Database Error: ${dbError.message}`)

    revalidatePath('/dashboard/youtube')
    return { success: true, result: data }

  } catch (error: any) {
    console.error("Pipeline Error:", error)
    return { success: false, error: error.message }
  }
}

// Internal AI helper to keep summarizeYoutube clean
async function callAI(prompt: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }]
    })
  })
  const data = await res.json()
  return data.choices[0]?.message?.content || ""
}
