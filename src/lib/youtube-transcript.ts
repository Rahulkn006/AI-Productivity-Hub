import { YoutubeTranscript } from "youtube-transcript"

/**
 * Extracts the video ID from various YouTube URL formats.
 * Supports: watch?v=, youtu.be/, embed/, and shorts/
 */
export function extractVideoId(url: string) {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  if (!match) throw new Error("Invalid YouTube URL")
  return match[1]
}

/**
 * Fetches the raw transcript text for a given video ID.
 */
export async function getTranscript(videoId: string) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return transcript.map((t) => t.text).join(" ")
  } catch (error: any) {
    console.error("Transcript fetch error:", error)
    throw new Error(
      "Transcript not available. The video may not provide captions."
    )
  }
}
