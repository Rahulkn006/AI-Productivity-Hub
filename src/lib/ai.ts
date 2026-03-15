import OpenAI from "openai"

// Centralized AI utility for OpenRouter
// API Compatibility: OpenRouter uses an OpenAI-compatible API

export const aiClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
})

export const DEFAULT_MODEL = 'deepseek/deepseek-chat'

// Helper function to handle AI calls gracefully
export async function generateAiResponse(prompt: string, model: string = DEFAULT_MODEL) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key is not configured.")
  }

  try {
    const response = await aiClient.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
      ]
    })

    return response.choices[0]?.message?.content || ""
  } catch (error: any) {
    console.error("AI Generation Error:", error)
    
    // Handle specific errors based on status or message
    if (error.message?.includes('401') || error.message?.includes('invalid API key')) {
      throw new Error("Invalid API Key for OpenRouter. Please check your configuration.")
    } else if (error.message?.includes('429')) {
      throw new Error("Rate limit exceeded. Please try again later.")
    } else if (error.message?.includes('model')) {
      throw new Error("AI Model is currently unavailable. Please try again later.")
    }
    
    throw new Error(error.message || "An unexpected error occurred during AI generation.")
  }
}

