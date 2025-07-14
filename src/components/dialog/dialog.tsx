import { Dialog, DialogProps } from "primereact/dialog";
import "./dialog.css"

export default function ZDialog(props: DialogProps){
    return(
        <Dialog {...props}  pt={{
                mask: {
                    style: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)", // fundo escuro com opacidade
                    },
                },
            }}  />
    )
}