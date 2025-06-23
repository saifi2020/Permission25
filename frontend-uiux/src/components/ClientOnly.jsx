import { useState, useEffect } from 'react'

/**
 * ClientOnly component to prevent hydration mismatches
 * Renders children only after client-side hydration is complete
 */
export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return children
} 