"use client"

import React, { useRef, useEffect, useState } from 'react'

interface AdvancedParticleSystemProps {
  mousePosition: { x: number; y: number }
  scrollY: number
  isActive: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  trail: Array<{ x: number; y: number; opacity: number }>
}

export const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = ({
  mousePosition,
  scrollY,
  isActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (typeof window === 'undefined') return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][
          Math.floor(Math.random() * 6)
        ],
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50,
        trail: [],
      }))
    }

    initParticles()

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particlesRef.current.forEach((particle) => {
        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = isActive ? Math.min(100 / (distance + 1), 2) : 0

        particle.vx += (dx / distance) * force * 0.01
        particle.vy += (dy / distance) * force * 0.01

        particle.vx *= 0.99
        particle.vy *= 0.99

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.trail.length > 10) particle.trail.shift()
        particle.trail.push({
          x: particle.x,
          y: particle.y,
          opacity: particle.opacity * 0.5,
        })

        particle.life--
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.offsetWidth
          particle.y = Math.random() * canvas.offsetHeight
          particle.life = particle.maxLife
        }

        particle.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (index / particle.trail.length)
          ctx.fillStyle = particle.color + Math.round(trailOpacity * 255).toString(16).padStart(2, '0')
          ctx.fillRect(point.x, point.y, particle.size * 0.5, particle.size * 0.5)
        })

        ctx.fillStyle = particle.color + Math.round(particle.opacity * 255).toString(16).padStart(2, '0')
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        if (distance < 100 && isActive) {
          ctx.strokeStyle = particle.color + '20'
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mousePosition.x, mousePosition.y)
          ctx.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClient, mousePosition, scrollY, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
