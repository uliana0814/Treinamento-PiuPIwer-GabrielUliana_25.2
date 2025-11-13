import { Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button"; // Reutilizando seu botão
import { Textarea } from "@/components/ui/TextArea"; // Reutilizando o Textarea que criamos

export function CreatePost() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
      
      {/* Usando o Textarea que combina com seu Input */}
      <Textarea 
        className="w-full bg-slate-50 rounded-xl p-4 text-slate-600 placeholder:text-slate-400 resize-none focus:ring-1 focus:ring-blue-200 border-0 min-h-[100px]"
        placeholder="No que você está pensando?"
      />
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        
        {/* Botão de Imagem (Amarelo) - Reutilizando seu Button com classes extras */}
        <Button 
          variant="outline"
          className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 font-medium text-sm"
        >
          <ImageIcon size={18} />
          Imagem
        </Button>

        {/* Botão de Publicar (Azul) - Reutilizando seu Button (variante default) */}
        <Button 
          variant="default" 
          className="font-bold text-sm shadow-md shadow-blue-200"
        >
          Publicar <Send size={16} />
        </Button>
      </div>
    </div>
  );
}