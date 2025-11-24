"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const ideaFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  idea: z.string().min(20, 'Please provide more details about your idea'),
  budget: z.string().optional(),
})

type IdeaFormData = z.infer<typeof ideaFormSchema>

export function IdeaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaFormSchema),
  })

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit idea')
      }

      setIsSuccess(true)
      toast.success('Idea submitted successfully! We\'ll be in touch soon.')
      reset()

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit idea. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
            Company (Optional)
          </label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Acme Inc"
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
            Budget Range (Optional)
          </label>
          <select
            id="budget"
            {...register('budget')}
            className="w-full h-10 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select a range</option>
            <option value="under-10k">Under $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-plus">$50,000+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="idea" className="block text-sm font-medium text-slate-300 mb-2">
          Tell us about your project *
        </label>
        <textarea
          id="idea"
          {...register('idea')}
          rows={6}
          placeholder="Describe your project idea, goals, and any specific requirements..."
          className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.idea && (
          <p className="mt-1 text-sm text-red-400">{errors.idea.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Submitted Successfully!
          </>
        ) : (
          'Submit Your Idea'
        )}
      </Button>
    </form>
  )
}
