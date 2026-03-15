"use client"

import { useState } from "react"
import { Bot, Sparkles, User, Loader2, Minimize2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

export function GlobalChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messagesList, setMessagesList] = useState<{role: string, content: string, id: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your AI Productivity Assistant. How can I help you today?', id: 'intro' }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // We are using custom state instead of useChat from ai/react because OpenRouter 
  // response structure in our API route doesn't perfectly align with the stream-based ai/react hooks out of the box
  // without more complex configuration. This custom implementation is robust for standard JSON responses.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input, id: Date.now().toString() }
    const newMessages = [...messagesList, userMessage]
    
    setMessagesList(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)

      setMessagesList([...newMessages, { role: 'assistant', content: data.content, id: data.id }])
    } catch (error) {
       console.error(error)
       setMessagesList([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.', id: Date.now().toString() }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className="h-14 w-14 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="relative z-10 w-6 h-6" />
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[75vh] z-50 flex flex-col shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transform transition-all duration-300 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
              <Bot className="w-5 h-5" />
              AI Assistant
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => setIsOpen(false)}>
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messagesList.map((m) => (
                <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${m.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex shrink-0 items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Form */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your notes or jobs..."
                className="flex-1 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 rounded-full bg-slate-50 dark:bg-slate-800 text-sm"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  )
}
