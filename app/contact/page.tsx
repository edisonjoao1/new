"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { Mail, MapPin, Send, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send')

      setIsSuccess(true)
      toast.success('Message sent! We will get back to you within 24 hours.')
      setFormData({ name: '', email: '', company: '', message: '' })

      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white min-h-screen pt-24">
        <section className="max-w-[1600px] mx-auto px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-8" />

            <div className="grid lg:grid-cols-2 gap-20">
              {/* Left: Info */}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
                  Contact
                </p>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight text-black mb-6">
                  Let's build
                  <br />
                  together
                </h1>
                <p className="text-xl text-gray-600 font-light leading-relaxed mb-12">
                  Have an AI product idea? Need to automate workflows? Looking to ship an MVP fast?
                  We respond within 24 hours and can start projects within a week.
                </p>

                {/* Contact info */}
                <div className="space-y-8 mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <p className="text-sm uppercase tracking-wider text-gray-500">Email</p>
                    </div>
                    <a
                      href="mailto:edison@ai4u.space"
                      className="text-2xl font-light text-black hover:text-gray-600 transition-colors"
                    >
                      edison@ai4u.space
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <p className="text-sm uppercase tracking-wider text-gray-500">Location</p>
                    </div>
                    <p className="text-2xl font-light text-black">Naples, Florida</p>
                    <p className="text-base text-gray-600 font-light">Remote-friendly, global clients</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-3xl font-light text-black mb-1">&lt; 24h</div>
                      <div className="text-sm uppercase tracking-wider text-gray-500">Response</div>
                    </div>
                    <div>
                      <div className="text-3xl font-light text-black mb-1">2-4w</div>
                      <div className="text-sm uppercase tracking-wider text-gray-500">Typical MVP</div>
                    </div>
                    <div>
                      <div className="text-3xl font-light text-black mb-1">10+</div>
                      <div className="text-sm uppercase tracking-wider text-gray-500">Apps shipped</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gray-50 rounded-3xl p-10 border border-gray-200">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm uppercase tracking-wider text-gray-600 mb-3 font-light">
                        Your name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 h-12 rounded-xl focus:border-black focus:ring-black font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm uppercase tracking-wider text-gray-600 mb-3 font-light">
                        Email address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@company.com"
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 h-12 rounded-xl focus:border-black focus:ring-black font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm uppercase tracking-wider text-gray-600 mb-3 font-light">
                        Company (optional)
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 h-12 rounded-xl focus:border-black focus:ring-black font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm uppercase tracking-wider text-gray-600 mb-3 font-light">
                        Tell us about your project *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="I want to build an AI-powered app that..."
                        rows={6}
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 rounded-xl focus:border-black focus:ring-black resize-none font-light"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full bg-black hover:bg-gray-900 text-white h-12 rounded-xl font-light tracking-wide transition-all duration-300 disabled:opacity-50"
                    >
                      {isSuccess ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Message sent!
                        </>
                      ) : isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center font-light">
                      We typically respond within 24 hours. Your information is kept confidential.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
