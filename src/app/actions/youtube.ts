"use server"

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
    // Decode common HTML entities in title
    title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    // Extract Description
    const descMatch = html.match(/"shortDescription":"(.*?)","isCrawlable"/i) || 
                     html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
    const description = descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : ""

    return {
      title,
      description,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
  } catch (e) {
    return { title: 'YouTube Video', description: '', thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }
  }
}

// ---------------------------------------------------------
// ROBUST TRANSCRIPT FETCHING (Manual bypass for production)
// ---------------------------------------------------------

async function fetchTranscriptManual(videoId: string) {
  const url = `https://www.youtube.com/watch?v=${videoId}`
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }

  try {
    const res = await fetch(url, { headers, cache: 'no-store' })
    const html = await res.text()

    // 1. Extract ytInitialPlayerResponse JSON
    const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+meta|window\["ytInitialData"\])/) || 
                     html.match(/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/)
    
    if (!jsonMatch) {
      // Fallback for some page structures
      if (html.includes('consent.youtube.com')) throw new Error("YouTube blocked request with a consent redirect.")
      throw new Error("Could not find video data on page.")
    }

    const playerResponse = JSON.parse(jsonMatch[1])
    const metadata = playerResponse?.captions?.playerCaptionsTracklistRenderer
    
    if (!metadata || !metadata.captionTracks || metadata.captionTracks.length === 0) {
      throw new Error("Transcripts are disabled or not available for this video.")
    }

    // 2. Fetch the XML transcript (prefer English/Auto-generated)
    const track = metadata.captionTracks.find((t: any) => t.languageCode === 'en') || metadata.captionTracks[0]
    const xmlUrl = track.baseUrl

    const xmlRes = await fetch(xmlUrl, { headers })
    const xmlText = await xmlRes.text()

    // 3. Simple XML Parsing (extracting text from <text> nodes)
    const parts = xmlText.match(/<text[^>]*>([\s\S]*?)<\/text>/g)
    if (!parts) throw new Error("Could not parse transcript XML.")

    return parts
      .map(part => {
        const text = part.replace(/<text[^>]*>|Header|<\/text>/g, '')
        // Decode common HTML entities
        return text
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#10;/g, ' ')
          .replace(/&#13;/g, ' ')
          .trim()
      })
      .filter(t => t.length > 0)
      .join(" ")

  } catch (err: any) {
    console.error(`[ManualTranscript] Error: ${err.message}`)
    // Fallback to library if manual fails (though unlikely to work if manual is blocked)
    const { YoutubeTranscript } = require("youtube-transcript")
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
    return transcriptData.map((t: any) => t.text).join(" ")
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

    // 3. Fetch transcript (using robust manual selector)
    console.log(`[YouTube] Fetching transcript for: ${videoId}`)
    let fullTranscript = ""
    let isMetadataFallback = false

    try {
      fullTranscript = await fetchTranscriptManual(videoId)
      if (!fullTranscript || fullTranscript.length < 50) {
        throw new Error("Transcript too short")
      }
      console.log(`[YouTube] Transcript successfully extracted (${fullTranscript.length} chars)`)
    } catch (transcriptError: any) {
      console.warn(`[YouTube] Transcript failed, falling back to metadata: ${transcriptError.message}`)
      isMetadataFallback = true
      fullTranscript = metadata.description || ""
      
      if (!fullTranscript || fullTranscript.length < 20) {
        throw new Error("Neither transcript nor video description is available for this video.")
      }
    }

    // 4. Chunk or Process Content
    const { chunkText } = require("@/lib/chunk-text")
    const contentToSummarize = fullTranscript
    const chunks = chunkText(contentToSummarize, 4000)
    let summaryResult = ""

    const jsonFormat = `{
      "summary": "detailed paragraph overview",
      "bullet_points": ["point 1", "point 2", ...],
      "key_points": ["takeaway 1", "takeaway 2", ...]
    }`

    const contextPrefix = isMetadataFallback 
      ? "The transcript for this video is unavailable. Based ONLY on the video title and description below, provide a structured summary."
      : "Analyze this YouTube transcript and return JSON only:"

    if (chunks.length === 1) {
      const prompt = `${contextPrefix} ${jsonFormat}\n\nTitle: ${metadata.title}\n\nContent: ${chunks[0]}`
      summaryResult = await callAI(prompt)
    } else {
      console.log(`[YouTube] Processing ${chunks.length} chunks...`)
      const chunkSummaries = []
      for (let i = 0; i < chunks.length; i++) {
        const chunkPrompt = `Summarize this section concisely:\n\n${chunks[i]}`
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
