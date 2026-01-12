"use client"

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'default' | 'minimal' | 'dark'
  className?: string
}

export function NewsletterSignup({ variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      setStatus('success')
      setMessage('Check your inbox for confirmation!')
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  if (variant === 'dark') {
    return (
      <div className={className}>
        <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-4">
          Newsletter
        </h4>
        <p className="text-sm font-light text-gray-400 mb-4">
          AI insights and updates. No spam.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-light text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="bg-white text-black px-4 py-2.5 rounded-lg text-sm font-light hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : status === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>
        {message && (
          <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-light text-black placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-light hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Subscribed
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    )
  }

  // Default variant
  return (
    <div className={`bg-gray-50 rounded-2xl p-8 ${className}`}>
      <h3 className="text-xl font-light text-black mb-2">Stay Updated</h3>
      <p className="text-gray-600 font-light text-sm mb-6">
        Get weekly AI insights, case studies, and development tips. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-light text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-black text-white px-6 py-3 rounded-xl text-sm font-light hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      {message && (
        <p className={`text-sm mt-3 ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-4">
        Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  )
}
