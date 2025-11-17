"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" 
import { Button } from "@/components/ui/button" 
import Link from "next/link"

const newsItems = [
  {
    category: "Tecnologia",
    title: "Nova atualização traz recursos inovadores",
    description: "Confira as novidades que chegaram hoje na plataforma.",
    imageUrl: "https://placehold.co/1200x500/1E293B/E2E8F0?text=Notícia+1", 
  },
  {
    category: "Esportes",
    title: "Final do campeonato é definida",
    description: "Times se preparam para o grande confronto no próximo fim de semana.",
    imageUrl: "https://placehold.co/1200x500/166534/E2E8F0?text=Notícia+2",
  },
  {
    category: "Comunidade",
    title: "PiuPiwer celebra 1 milhão de usuários!",
    description: "Nossa comunidade atingiu uma nova marca histórica esta semana.",
    imageUrl: "https://placehold.co/1200x500/0891B2/E2E8F0?text=Notícia+3",
  }
];

export default function HomeCaroussel() {
  return (
    <div className="w-full max-w-[700px] mx-auto"> 
      <Carousel 
        opts={{ align: "start", loop: true }} 
        className="relative rounded-2xl overflow-hidden shadow-lg" 
      >
        <CarouselContent>
          {newsItems.map((item, index) => (
            <CarouselItem key={index} className="basis-full p-0">
              
              <div className="relative w-full h-64 md:h-80">
                
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-linear-to-t from-black/80 to-transparent">
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">{item.category}</span>
                  <h3 className="text-xl md:text-3xl font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-sm md:text-base text-white/80 mt-2 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-5">
                    <Button 
                      asChild 
                      className="bg-amber-400 text-amber-900 font-bold hover:bg-amber-300"
                    >
                      <Link href="#">Ler mais</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-amber-400 text-amber-900 hover:bg-amber-300 border-none opacity-80 hover:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-amber-400 text-amber-900 hover:bg-amber-300 border-none opacity-80 hover:opacity-100" />
      </Carousel>
    </div>
  );
}