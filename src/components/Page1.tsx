import startImg from '../assets/startImg.jpg'

export default function Page1({ onNext }: { onNext: () => void }) {
  const handleClick = (e: React.MouseEvent) => {
    if (e.clientX > window.innerWidth / 2) onNext()
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
        src={startImg}
        alt=""
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  )
}
