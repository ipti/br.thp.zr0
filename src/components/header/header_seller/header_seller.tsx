"use client";

import { useRouter } from "next/navigation";
import "./header_seller.css"
import { useSlideBar } from "../../slider_bar/slide_bar_context";
import ZDropdown from "@/components/dropdown/dropdown";
import { useFetchRequestTransformationWorkshop } from "@/app/seller/transformation-workshop/service/query";
import { useEffect, useState } from "react";
import { getIdTw, idTw, logout } from "@/service/cookies";
import Image from "next/image";
import menu_in from "../../../assets/img/menu-in.svg";


export default function HeaderSeller() {
  const { toggleVisibility, isVisible} = useSlideBar();
  const navigate = useRouter();
  const [transformationWorkshop, setTransformationWorkshop] = useState<number | undefined>()
  const { data: transformationWorkshopRequest } = useFetchRequestTransformationWorkshop();

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 600);

    // Opcional: atualizar no resize
    function handleResize() {
      setIsDesktop(window.innerWidth > 600);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!transformationWorkshop && transformationWorkshopRequest && !getIdTw()) {


      setTransformationWorkshop(transformationWorkshopRequest![0]?.transformation_workshop?.id);
      idTw(transformationWorkshopRequest![0]?.transformation_workshop?.id);

    }
    if (getIdTw()) {
      setTransformationWorkshop(parseInt(getIdTw() ?? "1"))
    }
  }, [transformationWorkshopRequest, transformationWorkshop])



  return (
    <div className="w-full h-5rem flex flex-row justify-content-between">
      <div className="flex flex-row">
        <button
          type="button"
          onClick={toggleVisibility}
          className="flex flex-column justify-content-center cursor-pointer button-menu border-none"
          aria-label={isVisible ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isVisible}
        >
         <Image alt="" src={menu_in} height={24} style={{ transform: !isVisible ? '' : 'rotate(180deg)', margin: 12 }}/>
        </button>
        <div className="h-full flex flex-column justify-content-center">
          <button
            type="button"
            className="flex flex-row w-auto align-content-center cursor-pointer border-none bg-transparent p-0"
            onClick={() => {
              navigate.back();
            }}
          >
            <i className="pi pi-angle-left ml-2" style={{ fontSize: "1.5rem" }}></i>
            <div className="flex flex-column justify-content-center">
              <h4>Voltar</h4>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-row align-items-center justify-content-center mr-3">
        <ZDropdown style={{ display: isDesktop ? "flex" : "none" }} value={transformationWorkshop} onChange={(e) => { idTw(e.target.value); setTransformationWorkshop(e.target.value); window.location.reload() }} options={transformationWorkshopRequest} optionLabel="transformation_workshop.name" optionValue="transformation_workshop.id" className="w-14rem" />
        <button
          type="button"
          className="flex flex-row gap-2 ml-2 cursor-pointer border-none bg-transparent p-0"
          onClick={() => { logout(); window.location.reload() }}
        >
          <div className="flex flex-column justify-content-center">
            <i className="pi pi-sign-out"></i>
          </div>
          <div className="flex flex-column justify-content-center">
            <h3>Sair</h3>
          </div>
        </button>
      </div>
    </div>
  );
}
