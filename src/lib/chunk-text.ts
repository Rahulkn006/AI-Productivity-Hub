/**
 * Splits a long text into chunks of roughly equal size.
 * Defaults to 3000 characters which is safe for most LLM context windows.
 */
export function chunkText(text: string, chunkSize = 3000) {
  const chunks = []

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }

  return chunks
}
