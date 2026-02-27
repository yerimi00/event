export default function ImagePage({ src, label, onNext, onPrev }: { src: string; label?: string; onNext: () => void; onPrev: () => void }) {
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: '#fff',
        cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label && (
        <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>{label}</p>
      )}
      <img
        src={src}
        alt=""
        style={{ maxWidth: '100%', maxHeight: label ? '80dvh' : '100%', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  )
}
