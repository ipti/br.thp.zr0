"use client";
import { Menu } from "@/app/middleware/use_permission";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../assets/img/ZR0_logotipo.png";
import "./slider_bar.css";

export default function SlideBar({ itens }: {itens: Menu[]}) {
  const history = useRouter()

  console.log('itens', itens)
  return (
    <div className="container_slider w-20rem h-full">
      <div className="gap-4">
        <div className="flex flex-column justify-content-center align-items-center cursor-pointer" onClick={() => { history.push('/seller/home') }}>
          <Image alt="" src={logo} height={64} />
        </div>
        <div className="p-3" />
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
