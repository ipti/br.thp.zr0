'use client'

import { useRef, useState } from 'react'
import storeVideoPoster from '@/assets/img/product-store/store-video-poster.jpg'
import './store_video.css'

const VIDEO_SRC = 'https://zrodrive.blob.core.windows.net/video-zr0/videoplayback.mp4'

export default function StoreVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  function toggle() {
    const v = videoRef.current
    if (!v || error) return
    if (playing) {
      v.pause()
      setPlaying(false)
    } else {
      v.play().then(() => setPlaying(true)).catch(() => setError(true))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <section className="store-video" aria-label="Vídeo institucional ZR0">
      <div className="store-video__inner">
        <div
          className={`store-video__wrap${playing ? ' store-video__wrap--playing' : ''}`}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          aria-pressed={playing}
        >
          {error ? (
            <div className="store-video__error" role="status">
              <span aria-hidden="true">▶</span>
              <p>Vídeo temporariamente indisponível.</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="store-video__el"
              src={VIDEO_SRC}
              poster={storeVideoPoster.src}
              playsInline
              preload="metadata"
              muted={false}
              onEnded={() => setPlaying(false)}
              onError={() => setError(true)}
            >
              Seu navegador não suporta reprodução de vídeo.
            </video>
          )}

          {!error && (
            <div className="store-video__overlay" aria-hidden="true">
              <span className="store-video__play-btn">
                <span
                  className={playing ? 'store-video__pause-icon' : 'store-video__play-icon'}
                />
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
