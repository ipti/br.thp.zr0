'use client';
import "./video.css";
import { useState } from "react";

export default function VideoComponent() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Estado de controle

  const handleVideoToggle = () => {
    const video = document.getElementById("landingVideo");
    if (video) {
      if (isVideoPlaying) {
        video.pause(); // Pausar o vídeo
      } else {
        video.play(); // Reproduzir o vídeo
      }
    }
    setIsVideoPlaying(!isVideoPlaying); // Alternar estado
  };

  return (
    <section
      className="video-section"
      style={{
        padding: "2rem 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: "0rem",
      }}
      onClick={handleVideoToggle}
    >
      <div className="video-container">
        {/* Overlay com botão de reprodução/pausa */}
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
          src="https://zrodrive.blob.core.windows.net/video-zr0/videoplayback.mp4"
          autoPlay={!isVideoPlaying}
          hidden={!isVideoPlaying}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Faz o vídeo preencher toda a área
            borderRadius: "1rem",
          }}
        >
          Seu navegador não oferece suporte à tag de vídeo.
        </video>
      </div>
    </section>
  );
}