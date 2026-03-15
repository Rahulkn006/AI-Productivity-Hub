import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { extractVideoId, getTranscript } from '@/lib/youtube-transcript'
import { chunkText } from '@/lib/chunk-text'
import { generateAiResponse } from '@/lib/ai'
import { getYoutubeMetadata } from '@/app/actions/youtube'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    // 1. Extract video ID
    let videoId: string
    try {
      videoId = extractVideoId(url)
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }

    // 2. Get metadata
    const metadata = await getYoutubeMetadata(videoId)

    // 3. Fetch transcript (with metadata fallback)
    let fullTranscript: string
    let isMetadataFallback = false
    try {
      fullTranscript = await getTranscript(videoId)
    } catch (e: any) {
      console.warn(`[API] Transcript failed, falling back to description: ${e.message}`)
      isMetadataFallback = true
      fullTranscript = metadata.description || ""
    }

    if (!fullTranscript || fullTranscript.length < 20) {
      return NextResponse.json({ error: 'Neither a transcript nor a video description is available for this video.' }, { status: 400 })
    }

    // 4. Chunk transcript for long videos
    const chunks = chunkText(fullTranscript, 4000) 
    let summaryResult = ""

    if (chunks.length === 1) {
      // Single chunk summarization
      const prompt = `
        Analyze the following YouTube video transcript and provide a structured JSON response.
        Required JSON structure:
        {
          "summary": "A detailed paragraph summary.",
          "bullet_points": ["Point 1", "Point 2", ...],
          "key_points": ["Takeaway 1", "Takeaway 2", ...]
        }
        Make sure to provide valid, parsable JSON.
        
        Transcript:
        ${chunks[0]}
      `
      summaryResult = await generateAiResponse(prompt)
    } else {
      // Multi-stage summarization for long videos
      console.log(`[YouTube] Processing ${chunks.length} chunks for video ${videoId}`)
      const chunkSummaries = []
      
      for (let i = 0; i < chunks.length; i++) {
        const chunkPrompt = `Summarize this section of a YouTube video transcript concisely:\n\n${chunks[i]}`
        const chunkSummary = await generateAiResponse(chunkPrompt)
        chunkSummaries.push(chunkSummary)
      }

      // Merge summaries
      const finalPrompt = `
        Merge the following partial summaries of a long YouTube video into a cohesive, structured final report.
        Required JSON structure:
        {
          "summary": "A detailed paragraph summary combining all key phases of the video.",
          "bullet_points": ["Major point 1", "Major point 2", ...],
          "key_points": ["Critical takeaway 1", "Critical takeaway 2", ...]
        }
        Make sure to provide valid, parsable JSON.

        Partial summaries:
        ${chunkSummaries.join("\n\n---\n\n")}
      `
      summaryResult = await generateAiResponse(finalPrompt)
    }
    
    // 5. Parse JSON safely and support flexible keys
    let aiResult
    try {
      const jsonStr = summaryResult.substring(
        summaryResult.indexOf('{'),
        summaryResult.lastIndexOf('}') + 1
      )
      const parsed = JSON.parse(jsonStr)
      
      // Map flexible keys to our DB schema
      aiResult = {
        summary: parsed.summary || parsed.overview || parsed.detailed_summary || "",
        bullet_points: parsed.bullet_points || parsed.highlights || parsed.points || [],
        key_points: parsed.key_points || parsed.takeaways || parsed.key_takeaways || []
      }
    } catch (e) {
      console.error("Failed to parse AI response as JSON", summaryResult)
      return NextResponse.json({ error: 'AI failed to generate structural format. Please try again.' }, { status: 500 })
    }

    // 6. Save to Database (aligned with requested fields)
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

    if (dbError) {
      console.error("DB Error:", dbError)
      return NextResponse.json({ error: `Database Save Error: ${dbError.message}. Make sure you ran the SQL migration.` }, { status: 500 })
    }

    return NextResponse.json({ result: data })

  } catch (error: any) {
    console.error("YouTube Summary API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
