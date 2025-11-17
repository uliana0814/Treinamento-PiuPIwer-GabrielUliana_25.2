"use client" // <--- PRECISA SER CLIENT COMPONENT

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para atualizar o feed
import { Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button"; // Reutilizando seu botão
import { Textarea } from "@/components/ui/TextArea"; // Reutilizando o Textarea que criamos
import toast from "react-hot-toast"; // Para dar feedback

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Hook para atualizar a página

  const handleSubmit = async () => {
    if (content.trim().length < 3) {
      toast.error("O seu post precisa ter pelo menos 3 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // O browser anexa o cookie de autenticação automaticamente
        body: JSON.stringify({
          text: content, // O seu .bru disse que o corpo é { "text": "..." }
          // "imageUrl" é opcional, então não enviamos por enquanto
        }),
      });

      if (!res.ok) {
         // Tenta ler a mensagem de erro do backend
        const errorData = await res.json().catch(() => ({ message: "Falha ao criar o post." }));
        throw new Error(errorData.message || "Falha ao criar o post.");
      }

      // 2. Se deu certo
      toast.success("Post publicado!");
      setContent(""); // Limpa o campo de texto
      router.refresh(); // <--- ATUALIZA O FEED (re-roda o getPosts da página)

    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
      
      <Textarea 
        className="w-full bg-slate-50 rounded-xl p-4 text-slate-600 placeholder:text-slate-400 resize-none focus:ring-1 focus:ring-blue-200 border-0 min-h-[100px]"
        placeholder="No que você está pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        
        <Button 
          variant="outline"
          className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 font-medium text-sm"
          disabled={isLoading}
        >
          <ImageIcon size={18} />
          Imagem
        </Button>

        <Button 
          variant="default" 
          className="font-bold text-sm shadow-md shadow-blue-200"
          onClick={handleSubmit} // <--- CHAMA A FUNÇÃO
          disabled={isLoading} // <--- Desativa enquanto envia
        >
          {isLoading ? "Publicando..." : "Publicar"} 
          {!isLoading && <Send size={16} />}
        </Button>
      </div>
    </div>
  );
}