"use client";
import "./video.css";
import { useEffect, useRef, useState } from "react";

export default function VideoComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // autoplay só funciona com muted
            video.play().then(() => {
              setIsVideoPlaying(true);
            }).catch((err) => {
              console.warn("Autoplay bloqueado até interação do usuário:", err);
            });
          } else {
            video.pause();
            setIsVideoPlaying(false);
          }
        });
      },
      { threshold: 0.5 } // 50% do vídeo visível
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleVideoToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoPlaying) {
      video.pause();
      setIsVideoPlaying(false);
    } else {
      video.muted = false; // libera áudio quando o usuário interage
      video.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <section
      className="video-section"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="video-container">
        {/* Overlay com botão */}
        <div className="overlay flex-column align-items-center justify-content-center">
          <button
            className="play-btn border-circle flex align-items-center justify-content-center"
            onClick={handleVideoToggle}
          >
            {isVideoPlaying ? (
              <i className="pi pi-pause text-4xl" />
            ) : (
              <i className="pi pi-play text-4xl" />
            )}
          </button>
        </div>

        <video
          id="landingVideo"
          ref={videoRef}
          src="https://zrodrive.blob.core.windows.net/video-zr0/videoplayback.mp4"
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            marginTop: "8px",
            borderRadius: "1rem",
          }}
        >
          Seu navegador não oferece suporte à tag de vídeo.
        </video>
      </div>
    </section>
  );
}
