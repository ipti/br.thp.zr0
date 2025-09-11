import { primeFlex } from '@/utils/prime_flex';
import logo from '../../assets/img/ZR0_logotipo.png';
import Image from "next/image";


export default function Logo() {
      const prime = primeFlex();
    
    return (
        <div className={prime.flex + prime.column + prime.justify_center + "align-items-center mb-4"}>
        <Image src={logo} alt="" width={64} height={64} />
      </div>
    )
}