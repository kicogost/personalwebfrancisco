'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * A list entry that rises into place, staggered behind the ones above it.
 * A single CSS animation cannot stagger per item without hand written delays,
 * which is the one place on this site where motion earns its keep.
 *
 * Under prefers-reduced-motion the initial state is skipped entirely, so the
 * entry is simply there.
 */
export default function RevealItem({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <motion.li
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: reduce ? 0 : index * 0.09,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </motion.li>
  )
}
