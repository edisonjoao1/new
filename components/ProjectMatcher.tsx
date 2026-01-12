"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, Check } from 'lucide-react'
import Link from 'next/link'
import { projectCategories, getMatchedProjects, type MatchedProject } from '@/lib/project-matching'

interface ProjectMatcherProps {
  onSelectionChange?: (categories: string[]) => void
  className?: string
}

export function ProjectMatcher({ onSelectionChange, className = '' }: ProjectMatcherProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [matchedProjects, setMatchedProjects] = useState<MatchedProject[]>([])

  useEffect(() => {
    const projects = getMatchedProjects(selectedCategories)
    setMatchedProjects(projects)
    onSelectionChange?.(selectedCategories)
  }, [selectedCategories, onSelectionChange])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className={className}>
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm uppercase tracking-wider text-gray-600 mb-4 font-light">
          What are you building? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {projectCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-light text-sm leading-tight">{category.label}</div>
                    <div
                      className={`text-xs mt-1 leading-snug ${
                        isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {category.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Matched Projects */}
      <AnimatePresence>
        {matchedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm uppercase tracking-wider text-gray-600 mb-4 font-light">
                Relevant projects we've built
              </p>
              <div className="space-y-3">
                {matchedProjects.slice(0, 4).map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {project.url.startsWith('/') ? (
                      <Link href={project.url}>
                        <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-light text-black">{project.title}</span>
                                {project.stats && (
                                  <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                                    {project.stats}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-light leading-snug">
                                {project.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-light text-black">{project.title}</span>
                                {project.stats && (
                                  <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                                    {project.stats}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-light leading-snug">
                                {project.description}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
              {matchedProjects.length > 4 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  + {matchedProjects.length - 4} more relevant projects
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
