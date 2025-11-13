import LandingPagesNav from "@/components/base/nav/InitialNav";
import { headers } from "next/headers";
import { auth } from "@/auth";
import CarouselExample from "./_components/CarouselExample";
import PiuPiwer from '@/components/svgs/piupiwer.png'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const isLogged = !!session?.user;

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingPagesNav isLogged={isLogged} />
      
      <main className="w-full pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 bg-blue-50">
        <img src={PiuPiwer.src} alt="PiuPiwer Logo" className="w-32 h-32 mb-6" />
        <h1 className="font-extrabold text-6xl md:text-7xl text-blue-600 tracking-tight">
          PiuPiwer
        </h1>
        <p className="pt-6 text-xl md:text-2xl text-slate-600 max-w-2xl">
          Conecte-se com seus amigos e veja o que está acontecendo no mundo agora.
        </p>
      </main>

      <div className="py-16 w-full flex flex-col items-center justify-center bg-blue-50 border-t border-slate-100">
        <h2 className="text-3xl font-semibold text-slate-800">
          Destaques da Comunidade
        </h2>
        <CarouselExample />
      </div>
    </div>
  );
}