export default function TextPage({ text, onNext, onPrev }: { text: string; onNext: () => void; onPrev: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.clientX > window.innerWidth / 2) onNext()
    else onPrev()
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <p style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', padding: '0 40px', margin: 0, lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  )
}
