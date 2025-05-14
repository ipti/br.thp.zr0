"use client"
import { redirect } from "next/navigation";
import { SliderBarType } from "./type";
import './slider_bar.css'

export default function SlideBar({ itens }: SliderBarType) {
  return (
    <div className="container_slider w-8rem h-full">
     
      <div className="gap-2">

      {itens?.map((item, index) => {
        return (
          <div key={index} className="flex flex-column item_slider" onClick={() => {
            redirect(item.link)
          }}>
            <div className="flex flex-row justify-content-center text-2xl">{item.icon}</div>
            <div className="p-1"></div>
            <div className="label">{item.label}</div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
