import Link from "next/link";
import PiuPiwer from '@/components/svgs/piupiwer.png';
import Image from "next/image";

function NavbarLogo({ isH2 }: { isH2?: boolean }) {
  return ( 
    <Link className="flex items-center gap-4" href="/">
      <Image 
        src={PiuPiwer} 
        alt="Logo PiuPiwer" 
        className="w-10 h-auto"
      />
      {isH2 ? 
        <h2 className="font-bold text-3xl">PiuPiwer</h2>
        :
        <h1 className="font-bold text-3xl">PiuPiwer</h1>
      }
    </Link>
   );
}

export default NavbarLogo;