"use client";
import { Menu } from "@/app/middleware/use_permission";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../assets/img/ZR0_logotipo.png";
import "./slider_bar.css";
import { useEffect } from "react";

interface SlideBarProps {
  itens: Menu[];
  isOpen: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SlideBar({ itens, isOpen, isMobile, onClose }: SlideBarProps) {
  const history = useRouter()

  useEffect(() => {
    if (!isMobile || !isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMobile, isOpen, onClose])

  const navigateTo = (link: string) => {
    history.push(link)
    if (isMobile) onClose?.()
  }

  return (
    <>
      {isMobile && isOpen && (
        <div className="slider_backdrop" onClick={onClose} aria-hidden="true" />
      )}
      <nav
        aria-label="Menu principal"
        aria-hidden={isMobile && !isOpen ? true : undefined}
        className={"h-full" + (!isOpen ? " container_slider " : " container_slider_expanded")}
      >
        <div className="">
          <div
            className="flex flex-row justify-content-center align-content-between mt-2"
            role="button"
            tabIndex={0}
            onClick={() => navigateTo('/seller/home')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigateTo('/seller/home')
              }
            }}
          >
            <Image className="cursor-pointer" alt="Ir para o início" src={logo} height={32} style={{margin: 12}} />
          </div>
          <div className="p-2" />
          {itens?.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-row item_slider"
                role="button"
                tabIndex={0}
                aria-label={item.label}
                onClick={() => navigateTo(item.link)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigateTo(item.link)
                  }
                }}
              >
                <div className="flex flex-row justify-content-center text-2xl">
                  <i className={item.icon} aria-hidden="true" />
                </div>
                {isOpen && <>
                <div className="p-2"></div>
                <div className="flex flex-column justify-content-center">
                  <div className="label">{item.label}</div>
                </div>
                </>}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
