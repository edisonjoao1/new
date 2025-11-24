"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface GuidedAIPlanProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    id: 1,
    question: 'What problem should AI fix first in your business?',
    type: 'text' as const,
    placeholder: 'e.g., Manual data entry takes 6 hours per day',
  },
  {
    id: 2,
    question: 'How fast do you want to move?',
    type: 'choice' as const,
    options: [
      { label: 'Quick wins', value: 'quick-wins' },
      { label: 'Automation', value: 'automation' },
      { label: 'MVP build', value: 'mvp' },
      { label: "Not sure yet", value: 'not-sure' },
    ],
  },
  {
    id: 3,
    question: "What's the best way to reach you?",
    type: 'contact' as const,
  },
]

export function GuidedAIPlan({ isOpen, onClose }: GuidedAIPlanProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    problem: '',
    speed: '',
    name: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleNext = () => {
    const step = steps[currentStep]

    // Validate current step
    if (step.type === 'text' && !answers.problem.trim()) {
      toast.error('Please describe your problem')
      return
    }
    if (step.type === 'choice' && !answers.speed) {
      toast.error('Please select an option')
      return
    }
    if (step.type === 'contact' && (!answers.name.trim() || !answers.email.trim())) {
      toast.error('Please enter your name and email')
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.name,
          email: answers.email,
          idea: `Problem: ${answers.problem}\n\nTimeline: ${answers.speed}`,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setIsComplete(true)
      toast.success('Your AI plan is on the way!')

      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(0)
    setAnswers({ problem: '', speed: '', name: '', email: '' })
    setIsSubmitting(false)
    setIsComplete(false)
  }

  const step = steps[currentStep]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-light text-black">Your AI Plan</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-black"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-light text-black mb-2">All set!</h3>
                    <p className="text-gray-600">
                      I'll review your plan and get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl font-light text-black mb-8 leading-tight">
                      {step.question}
                    </h3>

                    {/* Text input */}
                    {step.type === 'text' && (
                      <textarea
                        value={answers.problem}
                        onChange={(e) => setAnswers({ ...answers, problem: e.target.value })}
                        placeholder={step.placeholder}
                        className="w-full h-40 p-4 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        autoFocus
                      />
                    )}

                    {/* Choice buttons */}
                    {step.type === 'choice' && (
                      <div className="space-y-3">
                        {step.options?.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setAnswers({ ...answers, speed: option.value })}
                            className={`w-full p-4 text-left text-lg border rounded-lg transition-all ${
                              answers.speed === option.value
                                ? 'border-black bg-black text-white'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Contact form */}
                    {step.type === 'contact' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Name</label>
                          <Input
                            value={answers.name}
                            onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                            placeholder="John Doe"
                            className="text-lg p-4 h-auto"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Email</label>
                          <Input
                            type="email"
                            value={answers.email}
                            onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                            placeholder="john@example.com"
                            className="text-lg p-4 h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!isComplete && (
              <div className="p-6 border-t border-gray-100">
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-gray-800 text-lg py-6 rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    'Get My AI Plan'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
