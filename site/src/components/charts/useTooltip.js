import { useCallback, useRef, useState } from 'react'

/**
 * Tracks which datum is hovered plus where to draw the tooltip, in pixels
 * relative to the chart container.
 */
export function useTooltip() {
  const containerRef = useRef(null)
  const [tip, setTip] = useState(null)

  const show = useCallback((event, payload) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Keep the bubble inside the container so it never spills off-screen.
    const x = Math.min(Math.max(event.clientX - rect.left, 80), rect.width - 80)
    setTip({ x, y: event.clientY - rect.top, ...payload })
  }, [])

  const hide = useCallback(() => setTip(null), [])

  return { containerRef, tip, show, hide }
}
