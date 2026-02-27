import secondImg from '../assets/secondImg.jpg'

export default function Page2({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
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
      <img
        src={secondImg}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  )
}
