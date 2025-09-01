import ZSplitter from "@/components/splitter/splitter";
import home_right from "../../../assets/img/home_right.png";
import home_left from "../../../assets/img/left-home.png";
import logo_white from "../../../assets/img/logo_white.png";
import Image from "next/image";
import "./splitter_home.css";
import ZSplitterPanel from "@/components/splitter_panel/splitter_panel";

export default function SplitterHome() {
    return (
        <div className="container_splitter_home">
            <div className="container_logo">
                <Image alt="Logo white" src={logo_white} width={128} height={128} />
                <h1>Transformando plástico em{"\n"}</h1>
                <h1>em oportunidades</h1>
            </div>
            <div className="h-full">
                <ZSplitter className="h-full">
                    <ZSplitterPanel className="relative  h-full w-full" size={30}><Image alt="" fill
                        style={{ objectFit: "cover" }} src={home_left} /></ZSplitterPanel>
                    <ZSplitterPanel className="relative  h-full w-full" size={70}><Image alt="" fill
                        style={{ objectFit: "cover" }} src={home_right} /></ZSplitterPanel>
                </ZSplitter>
            </div>
        </div>
    )
}