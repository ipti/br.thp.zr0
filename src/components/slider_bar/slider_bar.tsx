"use client";
import { redirect } from "next/navigation";
import { SliderBarType } from "./type";
import "./slider_bar.css";

export default function SlideBar({ itens }: SliderBarType) {
  return (
    <div className="container_slider w-18rem h-full">
      <div className="gap-4">
        <div className="p-3">
          Logo
        </div>
        {itens?.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-row item_slider"
              onClick={() => {
                redirect(item.link);
              }}
            >
              <div className="flex flex-row justify-content-center text-2xl">
                {item.icon}
              </div>
              <div className="p-2"></div>
              <div className="flex flex-column justify-content-center">
                <div className="label">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
