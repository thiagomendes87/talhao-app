'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type UseCountUpOptions = {
  end: number
  duration?: number
  decimals?: number
  locale?: string
  enabled?: boolean
}

const easeOutExpo = (value: number) => {
  if (value >= 1) {
    return 1
  }

  return 1 - Math.pow(2, -10 * value)
}

export default function useCountUp({
  end,
  duration = 1600,
  decimals = 0,
  locale = 'pt-BR',
  enabled = false,
}: UseCountUpOptions) {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    setValue(0)
    startTimeRef.current = null

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)

      setValue(end * eased)

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [duration, enabled, end])

  return useMemo(() => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }, [decimals, locale, value])
}
