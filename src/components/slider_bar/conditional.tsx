"use client"
import { Menu } from "@/app/middleware/use_permission";
import SlideBar from "@/components/slider_bar/slider_bar";
import { useSlideBar } from "./slide_bar_context";

export function ConditionalSlideBar({ itens }: { itens: Menu[] }) {
  const { isVisible } = useSlideBar();

  if (!isVisible) return null;

  return <SlideBar itens={itens} />;
}
