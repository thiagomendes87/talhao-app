'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease,
    },
  }),
}

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
    >
      {children}
    </motion.div>
  )
}
