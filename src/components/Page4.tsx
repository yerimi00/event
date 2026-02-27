import endImg from '../assets/endImg.jpg'

export default function Page4({ onPrev }: { onPrev: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.clientX <= window.innerWidth / 2) onPrev()
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
        src={endImg}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  )
}
