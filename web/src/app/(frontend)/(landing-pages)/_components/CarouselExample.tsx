import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Heart, MessageCircle, Repeat2, Share2, Verified } from "lucide-react"; 

const tweets = [
  {
    name: "Flamengo",
    handle: "@Flamengo",
    content: "VENCE O FLAMENGO! ❤️🖤 Mais uma vitória importante no Maracanã! A Nação fez a festa! 🙅‍♂️⚽ #VamosFlamengo",
    time: "2h",
    verified: true, 
    color: "EF4444" 
  },
  {
    name: "Casimiro",
    handle: "@Casimiro",
    content: "Aceitas? 🍔 Simplesmente o melhor lanche da história. Quem discorda é maluco. Papo reto.",
    time: "45min",
    verified: true,
    color: "EAB308" 
  },
  {
    name: "Arrascaeta",
    handle: "@arrascaeta10",
    content: "Focado no próximo jogo. Seguimos por mais! 🙏⚽ Vamos mengão.",
    time: "5h",
    verified: true,
    color: "2563EB" 
  },
  {
    name: "Rocketseat",
    handle: "@rocketseat",
    content: "Quem aí já está codando hoje? 💜🚀 O aprendizado nunca para! Bora codar que o foguete não tem ré! #dev",
    time: "10min",
    verified: true,
    color: "9333EA"
  },
]

export default function CarouselExample() {
  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-6">
      <div className="mb-6 flex items-center gap-2">
   </div>

      <Carousel 
        opts={{ align: "start" }}
        className="relative"
      >
        <CarouselContent className="-ml-4 py-4">
          {tweets.map((tweet, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between">
                
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${tweet.name}&background=${tweet.color}&color=fff&bold=true`} 
                        alt={tweet.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      
                      <div className="leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-900 text-[15px]">
                            {tweet.name}
                          </span>
                          {tweet.verified && (
                            <Verified className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                          )}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">
                          {tweet.handle} · {tweet.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 text-[15px] leading-relaxed mb-4">
                    {tweet.content}
                  </p>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden sm:flex -left-4 h-12 w-12 border-none bg-white/80 hover:bg-blue-50 text-blue-600 shadow-lg backdrop-blur-sm" />
        <CarouselNext className="hidden sm:flex -right-4 h-12 w-12 border-none bg-white/80 hover:bg-blue-50 text-blue-600 shadow-lg backdrop-blur-sm" />
      </Carousel>
    </div>
  )
}