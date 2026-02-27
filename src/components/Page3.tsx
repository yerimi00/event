import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import basicImg from '../assets/basic.jpg'
import goodImg from '../assets/3-good.jpg'
import badImg from '../assets/3-bad.jpg'

const BTN_SIZE = 64

function isOverZone(cx: number, cy: number, ref: RefObject<HTMLDivElement | null>): boolean {
  if (!ref.current) return false
  const rect = ref.current.getBoundingClientRect()
  const radius = rect.width / 2
  return Math.hypot(cx - (rect.left + radius), cy - (rect.top + radius)) < radius * 1.5
}

function getDDay(): string {
  const today = new Date()
  const target = new Date(today.getFullYear(), 2, 1) // March 1
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > 0) return `D-${diffDays}`
  if (diffDays === 0) return 'D-Day'
  return `D+${Math.abs(diffDays)}`
}

export default function Page3({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [result, setResult] = useState<'none' | 'good' | 'bad'>('none')
  const [hovered, setHovered] = useState<'none' | 'good' | 'bad'>('none')
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)

  const isDraggingRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const leftZoneRef = useRef<HTMLDivElement>(null)
  const rightZoneRef = useRef<HTMLDivElement>(null)
  const justDropped = useRef(false)

  const rightPlaceholderRef = useRef<HTMLDivElement>(null)
  const rightInitialPos = useRef<{ x: number; y: number } | null>(null)
  const rightCurrentPos = useRef<{ x: number; y: number } | null>(null)
  const [rightDisplayPos, setRightDisplayPos] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    if (rightPlaceholderRef.current && leftZoneRef.current) {
      const rightRect = rightPlaceholderRef.current.getBoundingClientRect()
      const leftRect = leftZoneRef.current.getBoundingClientRect()
      const pos = {
        x: rightRect.left + rightRect.width / 2,
        y: leftRect.top + leftRect.height / 2,
      }
      rightInitialPos.current = pos
      rightCurrentPos.current = { ...pos }
      setRightDisplayPos({ ...pos })
    }
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const cx = e.clientX - offsetRef.current.x
      const cy = e.clientY - offsetRef.current.y
      setDragPos({ x: cx, y: cy })
      if (isOverZone(cx, cy, leftZoneRef)) setHovered('good')
      else if (isOverZone(cx, cy, rightZoneRef)) setHovered('bad')
      else setHovered('none')

      // 응시러 원 도망 로직
      if (rightCurrentPos.current) {
        const { x: rx, y: ry } = rightCurrentPos.current
        const dist = Math.hypot(cx - rx, cy - ry)
        if (dist < 130 && dist > 0) {
          const angle = Math.atan2(cy - ry, cx - rx)
          const newX = Math.max(50, Math.min(window.innerWidth - 50, rx - Math.cos(angle) * 120))
          const newY = Math.max(50, Math.min(window.innerHeight - 50, ry - Math.sin(angle) * 120))
          rightCurrentPos.current = { x: newX, y: newY }
          setRightDisplayPos({ x: newX, y: newY })
        }
      }
    }

    const onUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const cx = e.clientX - offsetRef.current.x
      const cy = e.clientY - offsetRef.current.y
      setDragPos(null)
      setHovered('none')
      if (isOverZone(cx, cy, leftZoneRef)) {
        justDropped.current = true
        setTimeout(() => { justDropped.current = false }, 500)
        setResult('good')
      } else if (isOverZone(cx, cy, rightZoneRef)) {
        justDropped.current = true
        setTimeout(() => { justDropped.current = false }, 500)
        setResult('bad')
      }

      // 원래 위치로 복귀
      if (rightInitialPos.current) {
        rightCurrentPos.current = { ...rightInitialPos.current }
        setRightDisplayPos({ ...rightInitialPos.current })
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDraggingRef.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    offsetRef.current = {
      x: e.clientX - (rect.left + rect.width / 2),
      y: e.clientY - (rect.top + rect.height / 2),
    }
    setDragPos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (justDropped.current) return
    if (e.clientX > window.innerWidth / 2) onNext()
    else onPrev()
  }

  return (
    <div
      onClick={handleContainerClick}
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 24px 64px',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* 헤더 - 항상 flow에 유지해서 아래 요소 위치 고정 */}
      <div style={{ textAlign: 'center', visibility: result !== 'none' ? 'hidden' : 'visible' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.4 }}>
          {`나랑 3월 1일에 놀래?(${getDDay()})`}
        </h1>
        <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>
          아래 버튼을 원하는 원에 드래그 하세요.
        </p>
      </div>

      {/* 결과 텍스트 오버레이 */}
      {result !== 'none' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '22vw', fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
            {result === 'good' ? '사랑해💕' : '응 니 나가'}
          </span>
        </div>
      )}

      {/* 사진 */}
      <div
        style={{
          width: '70vw',
          maxWidth: 280,
          aspectRatio: '1 / 1',
          borderRadius: '16px',
          background: undefined,
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {result === 'none' && hovered === 'none' && (
          <img src={basicImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        )}
        {(result === 'good' || hovered === 'good') && (
          <img src={goodImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        )}
        {(result === 'bad' || hovered === 'bad') && (
          <img src={badImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
        )}
      </div>

      {/* 드롭존 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>웅 구래</span>
          <div
            ref={leftZoneRef}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: result === 'good' ? '#ffd6e0' : '#e8e8e8',
              border: result === 'good' ? '3px solid #ff8fab' : '3px solid #ddd',
              transition: 'background 0.3s, border 0.3s',
            }}
          />
        </div>
        {/* 플레이스홀더 - 레이아웃 공간 유지 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, visibility: 'hidden' }}>응시러~ ㅋ</span>
          <div ref={rightPlaceholderRef} style={{ width: 80, height: 80 }} />
        </div>
      </div>

      {/* 드래그 버튼 or 힌트 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: BTN_SIZE }}>
        {result === 'none' && dragPos === null && (
          <div
            onPointerDown={handlePointerDown}
            style={{
              width: BTN_SIZE,
              height: BTN_SIZE,
              borderRadius: '50%',
              background: '#d0d0d0',
              cursor: 'grab',
              touchAction: 'none',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
        )}
        {result === 'none' && dragPos !== null && (
          <div style={{ width: BTN_SIZE, height: BTN_SIZE }} />
        )}
        {result !== 'none' && (
          <p style={{ fontSize: '13px', color: '#bbb', margin: 0 }}>
            화면을 클릭하여 다음으로
          </p>
        )}
      </div>

      {/* 응시러 원 - fixed, 도망다님 */}
      {rightDisplayPos && (
        <div
          style={{
            position: 'fixed',
            left: rightDisplayPos.x - 40,
            top: rightDisplayPos.y - 40,
            width: 80,
            height: 80,
            transition: 'left 0.12s ease-out, top 0.12s ease-out',
            zIndex: 10,
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '16px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            응시러~ ㅋ
          </span>
          <div
            ref={rightZoneRef}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: result === 'bad' ? '#d6e4ff' : '#e8e8e8',
              border: result === 'bad' ? '3px solid #6fa3ff' : '3px solid #ddd',
              transition: 'background 0.3s, border 0.3s',
            }}
          />
        </div>
      )}

      {/* 드래그 중 떠다니는 버튼 */}
      {dragPos !== null && (
        <div
          style={{
            position: 'fixed',
            left: dragPos.x - BTN_SIZE / 2,
            top: dragPos.y - BTN_SIZE / 2,
            width: BTN_SIZE,
            height: BTN_SIZE,
            borderRadius: '50%',
            background: '#bbb',
            zIndex: 999,
            pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        />
      )}
    </div>
  )
}
