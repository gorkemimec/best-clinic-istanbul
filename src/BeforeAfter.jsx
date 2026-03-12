import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * BeforeAfter Swipe Slider
 * - Sürüklenebilir orta çizgi ile before/after karşılaştırma
 * - Touch & mouse desteği
 * - beforeSrc ve afterSrc prop'ları ile görseller sonradan eklenebilir
 */
export default function BeforeAfter({ beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After', height = 420 }) {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50) // yüzde
  const dragging = useRef(false)

  const getPercent = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 50
    const x = clientX - rect.left
    return Math.min(Math.max((x / rect.width) * 100, 2), 98)
  }, [])

  const onStart = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setPos(getPercent(clientX))
  }, [getPercent])

  const onMove = useCallback((e) => {
    if (!dragging.current) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setPos(getPercent(clientX))
  }, [getPercent])

  const onEnd = useCallback(() => {
    dragging.current = false
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [onMove, onEnd])

  return (
    <div
      ref={containerRef}
      className="ba-slider"
      style={{ height }}
      onMouseDown={onStart}
      onTouchStart={onStart}
    >
      {/* AFTER (tam genişlik arka plan) */}
      <div className="ba-layer ba-after">
        {afterSrc ? (
          <img src={afterSrc} alt={afterLabel} draggable={false} />
        ) : (
          <div className="ba-placeholder">
            <span>📷</span>
            <p>{afterLabel} görseli eklenecek</p>
          </div>
        )}
      </div>

      {/* BEFORE (clip ile kırpılıyor) */}
      <div className="ba-layer ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeSrc ? (
          <img src={beforeSrc} alt={beforeLabel} draggable={false} />
        ) : (
          <div className="ba-placeholder before">
            <span>📷</span>
            <p>{beforeLabel} görseli eklenecek</p>
          </div>
        )}
      </div>

      {/* Sürükleme çizgisi */}
      <div className="ba-divider" style={{ left: `${pos}%` }}>
        <div className="ba-divider-line" />
        <div className="ba-handle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="8 4 4 8 8 12" />
            <polyline points="16 4 20 8 16 12" />
          </svg>
        </div>
      </div>

      {/* Etiketler */}
      <div className="ba-label ba-label-before" style={{ opacity: pos > 15 ? 1 : 0 }}>
        {beforeLabel}
      </div>
      <div className="ba-label ba-label-after" style={{ opacity: pos < 85 ? 1 : 0 }}>
        {afterLabel}
      </div>
    </div>
  )
}
