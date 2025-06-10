"use client"
import SlideBar from "@/components/slider_bar/slider_bar";
import { SliderBarType } from "@/components/slider_bar/type";
import { useSlideBar } from "./slide_bar_context";

export function ConditionalSlideBar({ itens }: { itens: SliderBarType["itens"] }) {
  const { isVisible } = useSlideBar();

  if (!isVisible) return null;

  return <SlideBar itens={itens} />;
}
