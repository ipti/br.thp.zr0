"use client";

import { useRouter } from "next/navigation";
import "./header_seller.css"
import { useSlideBar } from "../../slider_bar/slide_bar_context";
import ZDropdown from "@/components/dropdown/dropdown";
import { useFetchRequestTransformationWorkshop } from "@/app/seller/transformation-workshop/service/query";
import { useEffect, useState } from "react";
import { getIdTw, idTw } from "@/service/cookies";

export default function HeaderSeller() {
  const { toggleVisibility } = useSlideBar();
  const navigate = useRouter();
  const [transformationWorkshop, setTransformationWorkshop] = useState<number | undefined>()
  const { data: transformationWorkshopRequest } = useFetchRequestTransformationWorkshop();

  useEffect(() => {
    if (!transformationWorkshop && transformationWorkshopRequest && !getIdTw()) {

    
      setTransformationWorkshop(transformationWorkshopRequest![0]?.transformation_workshop?.id);
      idTw(transformationWorkshopRequest![0]?.transformation_workshop?.id);

    } 
    if(getIdTw()){
      setTransformationWorkshop(parseInt(getIdTw() ?? "1"))
    }
  }, [transformationWorkshopRequest, transformationWorkshop])



  return (
    <div className="w-full h-5rem flex flex-row justify-content-between">
      <div className="flex flex-row">
        <div onClick={toggleVisibility} className="flex flex-column justify-content-center cursor-pointer p-2 button-menu">
          <i className="pi pi-bars" style={{ fontSize: "1.5rem" }}></i>
        </div>
        <div className="h-full flex flex-column justify-content-center">
          <div
            className="flex flex-row w-auto align-content-center cursor-pointer"
            onClick={() => {
              navigate.back();
            }}
          >
            <i className="pi pi-angle-left ml-2" style={{ fontSize: "1.5rem" }}></i>
            {/* <div className="p-1" /> */}
            <h4 >Voltar</h4>
          </div>
        </div>
      </div>
      <div className="flex flex-column justify-content-center mr-3">
        <ZDropdown value={transformationWorkshop} onChange={(e) => { idTw(e.target.value); setTransformationWorkshop(e.target.value); window.location.reload() }} options={transformationWorkshopRequest} optionLabel="transformation_workshop.name" optionValue="transformation_workshop.id" className="w-14rem" />
      </div>
    </div>
  );
}
