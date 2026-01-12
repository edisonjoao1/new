"use client"

import { motion } from 'framer-motion'
import { EditorialNav } from '@/components/homepage/EditorialNav'
import { EditorialFooter } from '@/components/homepage/EditorialFooter'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqCategories = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How much does AI app development cost?',
        answer: `AI app development costs vary based on complexity:

**Rapid MVPs**: $15,000-25,000 for a production-ready AI app in 2-4 weeks. This includes full-stack development, deployment, and basic analytics.

**Full AI Products**: $40,000-80,000 for comprehensive applications with multiple features, integrations, and polish.

**Enterprise Systems**: $100,000+ for complex systems with custom model training, extensive integrations, and enterprise-grade security.

Key cost factors include: model complexity (GPT-5-mini vs GPT-5.2), integration requirements, and ongoing API usage costs.`
      },
      {
        question: 'How long does it take to build an AI app?',
        answer: `Our typical timelines:

**Rapid MVP**: 2-4 weeks from kickoff to production. We've shipped apps in as little as 1 day (from idea to App Store approved). Prototypes and demos? Even faster—hours, not days.

**Full Product**: 6-10 weeks including design, development, testing, and deployment.

**Enterprise Projects**: 3-6 months depending on complexity, integrations, and compliance requirements.

**Our Guarantee**: Don't believe our timelines? Test us. If we don't meet our committed delivery date, we build your app for free. Not a discount—free. That's how confident we are.

These timelines assume clear requirements and responsive collaboration. Scope creep is the main cause of delays.`
      },
      {
        question: 'What technologies do you work with?',
        answer: `We're full-stack AI specialists:

**AI/LLM**: GPT-5.2, Claude Opus 4.5, Gemini 3.0, OpenAI Realtime API, custom fine-tuning
**Mobile**: Native iOS (Swift/SwiftUI), React Native
**Web**: Next.js, React, TypeScript
**Backend**: Node.js, Python, serverless (Vercel, AWS)
**Databases**: PostgreSQL, Supabase, Pinecone (vector DB)
**Integrations**: Payment APIs, WhatsApp, custom REST/GraphQL APIs

We select the best tools for each project—no forcing everything into one framework.`
      },
      {
        question: 'Do you work with startups or only enterprises?',
        answer: `We work with both, and everything in between:

**Startups**: We love working with founders who need to move fast. Our rapid MVP model is designed for early-stage companies validating ideas.

**Growth Companies**: Teams with product-market fit who need AI features or specialized tools.

**Enterprises**: Fortune 500 companies who need production AI systems with enterprise requirements.

Our sweet spot is companies that value speed and are willing to ship iteratively rather than spending months on requirements.`
      }
    ]
  },
  {
    category: 'AI & Models',
    questions: [
      {
        question: 'What\'s the difference between GPT-5 and Claude?',
        answer: `Based on our production experience:

**GPT-5.2** excels at:
- Code generation and debugging
- Function calling and tool use
- Ecosystem integrations (TTS, Whisper, DALL-E)
- Structured output

**Claude Opus 4.5** excels at:
- Creative writing and content
- Nuanced conversations
- Complex reasoning (extended thinking)
- Following detailed instructions

**Cost comparison**:
- GPT-5-mini: $0.15/1M input tokens
- GPT-5.2: $2.50/1M input tokens
- Claude Opus 4.5: $15/1M input tokens

We often use multiple models in one project, routing requests to the best model for each task.`
      },
      {
        question: 'Can you integrate AI into my existing app?',
        answer: `Yes, AI integration is one of our core services. Common integration patterns:

**API Integration**: Add AI capabilities via API endpoints that your existing frontend calls.

**Backend Enhancement**: Add AI processing to your existing backend—document analysis, automation, etc.

**Conversational Layer**: Add chat or voice interfaces on top of existing functionality.

**MCP Servers**: For Claude-based applications, we build Model Context Protocol servers that connect AI to your systems.

Integration complexity depends on your existing architecture and what AI capabilities you need.`
      },
      {
        question: 'Do you do custom model training or fine-tuning?',
        answer: `Yes, when it makes sense:

**When fine-tuning helps**:
- Domain-specific vocabulary or knowledge
- Consistent output format requirements
- Brand voice matching
- Specialized task performance

**When fine-tuning isn't needed**:
- General-purpose chat applications
- Standard business automation
- Most MVP projects

Fine-tuning adds $5,000-15,000 to project cost depending on data preparation and training requirements. Often, good prompt engineering achieves similar results at lower cost—we'll advise honestly on what your project needs.`
      },
      {
        question: 'How do you handle AI safety and content moderation?',
        answer: `Multiple layers of protection:

**Prompt Engineering**: System prompts with clear guardrails and behavior boundaries.

**Content Filtering**: OpenAI and Anthropic both have built-in moderation. We add custom filters when needed.

**Rate Limiting**: Prevent abuse through request limits per user.

**Logging & Monitoring**: Track unusual patterns and flag potential misuse.

**User Reporting**: Easy way for users to report problematic outputs.

For sensitive applications (healthcare, finance, children), we implement additional domain-specific safeguards.`
      }
    ]
  },
  {
    category: 'Process & Working Together',
    questions: [
      {
        question: 'What does your development process look like?',
        answer: `Our typical process:

**Week 1**: Discovery & Design
- Requirements clarification
- Architecture planning
- Design mockups
- Tech stack finalization

**Weeks 2-3**: Development
- Core functionality
- AI integration
- Testing
- Weekly demos

**Week 4**: Polish & Deploy
- Bug fixes
- Performance optimization
- Production deployment
- Analytics setup

**Beyond**: Iteration based on user feedback

We do weekly demos so you see progress and can course-correct early. No disappearing for months then showing something unexpected.`
      },
      {
        question: 'How do you handle communication during projects?',
        answer: `Clear, consistent communication:

**Slack/Discord**: Day-to-day communication for quick questions and updates.

**Weekly Demos**: Every week, we show what's been built. No surprises.

**Documentation**: Technical docs and handoff materials included.

**Responsive**: We typically respond within hours during business hours.

We're based in Naples, Florida (Eastern Time) and work with teams globally. Time zone differences haven't been an issue with async communication.`
      },
      {
        question: 'What happens after the project launches?',
        answer: `Post-launch support options:

**Included** (30 days post-launch):
- Bug fixes
- Minor adjustments
- Performance monitoring
- Basic support

**Optional Retainer**:
- Ongoing development
- Feature additions
- Priority support
- Monthly hours

**Handoff**:
- Complete codebase access
- Documentation
- Knowledge transfer
- Your team takes over

We design systems to be maintainable by your team if you prefer to handle ongoing development internally.`
      },
      {
        question: 'Do you sign NDAs?',
        answer: `Yes, we're happy to sign NDAs before discussing project details.

We've worked with stealth startups, pre-announcement products, and proprietary business processes. Confidentiality is standard.

If you have a specific NDA, send it over. Otherwise, we have a standard mutual NDA we can use.`
      }
    ]
  },
  {
    category: 'Pricing & Contracts',
    questions: [
      {
        question: 'How does your pricing work?',
        answer: `We primarily work on fixed-price projects:

**Fixed Price** (most projects):
- Clear scope, clear budget
- No hourly tracking
- Risk is on us to deliver within budget
- Best for MVPs and defined projects

**Retainer** (ongoing work):
- Monthly hours
- Flexible scope
- Best for iteration and ongoing development

**Hourly** (rare):
- For consulting or undefined scope
- $200-300/hour depending on work type

We quote after understanding your project. Estimates are free.`
      },
      {
        question: 'What are your payment terms?',
        answer: `Standard terms:

**For projects under $30K**:
- 50% upfront to start
- 50% on completion

**For projects $30K+**:
- 33% upfront
- 33% at midpoint
- 34% on completion

**For retainers**:
- Monthly, paid in advance

We accept wire transfer, ACH, and major credit cards. International payments via Wise or crypto also work.`
      },
      {
        question: 'What if the project scope changes?',
        answer: `Scope changes happen—we handle them transparently:

**Small changes** (< 10% of scope): Usually absorbed at no extra cost.

**Medium changes** (10-30%): We discuss and provide a change order with clear pricing.

**Large changes** (> 30%): May require re-scoping the project.

The key is early communication. If you realize requirements are changing, tell us early. We can adapt—we just can't predict.

We also build flexibility into initial quotes for known unknowns.`
      },
      {
        question: 'Who owns the code and IP?',
        answer: `You do. 100%.

Upon final payment:
- Full source code ownership transfers to you
- All project-specific IP is yours
- No usage restrictions
- No ongoing royalties

We don't use client code for other projects without permission.

We may retain rights to reuse general-purpose libraries or frameworks we've built—this is disclosed upfront and doesn't affect your ownership of the project.`
      }
    ]
  }
]

export default function FAQPage() {
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    )
  }

  return (
    <>
      <EditorialNav onGetStarted={() => setIsPlanOpen(true)} />

      <main className="bg-white text-black min-h-screen pt-24">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-16 bg-black mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-8 font-light">
              FAQ
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight tracking-tight">
              Frequently asked
              <br />
              <span className="italic font-serif">
                questions
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl font-light leading-relaxed">
              Common questions about working with us, AI development, and our process.
              Can't find your answer? <Link href="/contact" className="underline hover:text-black">Get in touch</Link>.
            </p>
          </motion.div>
        </section>

        {/* FAQ Content */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-light mb-8 tracking-tight">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((item) => (
                  <div
                    key={item.question}
                    className="border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(item.question)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium pr-8">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          openQuestions.includes(item.question) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openQuestions.includes(item.question) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="prose prose-gray max-w-none">
                          <div className="text-gray-600 leading-relaxed whitespace-pre-line font-light">
                            {item.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-black p-12 text-center"
          >
            <div className="relative z-10">
              <MessageCircle className="w-12 h-12 text-white/50 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-white tracking-tight">
                Still have questions?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto font-light">
                We're happy to answer questions about your specific project or situation.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-black rounded-full font-medium"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <EditorialFooter />
    </>
  )
}
