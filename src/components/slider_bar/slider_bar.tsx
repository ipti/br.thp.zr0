"use client";
import { Menu } from "@/app/middleware/use_permission";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../assets/img/ZR0_logotipo.png";
import "./slider_bar.css";
import { useState } from "react";

export default function SlideBar({ itens, isOpen }: {itens: Menu[], isOpen: boolean}) {
  const history = useRouter()

  return (
    <div className={"h-full" + (!isOpen ? " container_slider " : " container_slider_expanded")}>
      <div className="">
        <div className="flex flex-row justify-content-center align-content-between mt-2" onClick={() => { history.push('/seller/home') }}>
          <Image className="cursor-pointer" alt="" src={logo} height={32} style={{margin: 12}} />
          {/* <Image alt="" onClick={() => setIsOpen(!isOpen)} src={menu_in} height={16} style={{ transform: !isOpen ? '' : 'rotate(180deg)', margin: 12 }}/> */}
        </div>
        <div className="p-2" />
        {itens?.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-row item_slider"
              onClick={() => {
                history.push(item.link);
              }}
            >
              <div className="flex flex-row justify-content-center text-2xl">
                <i className={item.icon} />
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
    </div>
  );
}
