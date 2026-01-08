'use client'

import { useRouter } from "next/navigation"

export default function BackButton() {
    const history = useRouter()
    return (
        <>
            <div className="gap-2 flex flex-row cursor-pointer" onClick={() => history.back()}>
                <div className="flex flex-column justify-content-center">
                    <i className="pi pi-arrow-left"></i>
                </div>
                <div>
                    Voltar
                </div>
            </div>
        </>
    )
}