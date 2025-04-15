"use client"
import { useRouter } from "next/navigation"
import "./topbar.css"



export default function TopBar() {

     const useNavigate = useRouter()


    return (
        <div className="container">
            <div>
                Logo
            </div>
            <input></input>
            <div onClick={() => useNavigate.push("/login")}>menu</div>
        </div>
    )
}