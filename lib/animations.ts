// Animation configuration for consistent motion throughout the app
// Based on framer-motion patterns
import type { Transition } from 'framer-motion'

const easeOut: Transition = { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }
const easeInOut: Transition = { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 } as Transition
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: easeOut
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: easeOut
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] } as Transition
}

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: easeOut
}

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: easeOut
}

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 } as Transition
}

// Spring animations for interactive elements
export const springScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 } as Transition
}

export const springButton = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 } as Transition
}

// Collapse/expand animation
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: easeInOut
}

// Skeleton pulse animation (CSS keyframes)
export const skeletonPulse = 'animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700'

// Progress bar animation
export const progressBar = {
  initial: { width: 0 },
  animate: (value: number) => ({
    width: `${value}%`,
    transition: { duration: 0.8, ease: [0.0, 0.0, 0.2, 1] }
  })
}

// Number counter animation config
export const numberSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 30,
  mass: 1
}
