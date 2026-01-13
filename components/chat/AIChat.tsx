"use client"

import { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import { X, Maximize2, Minimize2, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: data.id || `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Something went wrong'))
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const sendQuickAction = useCallback(async (action: string) => {
    if (isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: action,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: action }],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: data.id || `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Something went wrong'))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const quickActions = [
    'What services do you offer?',
    'How much does app development cost?',
    'What is your turnaround time?',
    'Tell me about recent projects',
  ]

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 z-50"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl transition-all duration-300',
            isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-blue-900/50 to-cyan-900/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="flex flex-col h-[calc(100%-3.5rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-slate-400 py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">Hi! How can I help you today?</p>
                      <div className="space-y-2">
                        {quickActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => sendQuickAction(action)}
                            className="block w-full text-sm text-left px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg px-4 py-2',
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-200'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-700 text-white text-xs">
                            You
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-800 rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-center text-red-400 text-sm p-2 bg-red-900/20 rounded-lg">
                      Error: {error.message || 'Failed to send message. Please check your API key.'}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  )
}
