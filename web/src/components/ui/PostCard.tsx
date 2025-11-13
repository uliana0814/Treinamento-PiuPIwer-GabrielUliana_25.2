import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button"; // Reutilizando seu botão

interface PostProps {
  author: string;
  handle: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  color: string;
}

export function PostCard({ author, handle, time, content, likes, comments, color }: PostProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: color }}>
            {author.charAt(0)}
          </div>
          <div className="leading-tight">
            <h3 className="font-bold text-slate-900">{author}</h3>
            <span className="text-xs text-slate-500">{handle} • {time}</span>
          </div>
        </div>
        
        {/* Usando Button com variante 'ghost' para o ícone de '...' */}
        <Button variant="ghost" size="icon" className="text-slate-400">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Conteúdo */}
      <p className="text-slate-700 leading-relaxed text-[15px] mb-4">
        {content}
      </p>

      {/* Rodapé de Interações */}
      <div className="flex items-center gap-1 pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 group hover:bg-red-50">
          <Heart size={18} />
          <span className="ml-2 text-xs font-medium">{likes}</span>
        </Button>

        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 group hover:bg-blue-50">
          <MessageCircle size={18} />
          <span className="ml-2 text-xs font-medium">{comments}</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-green-500 group hover:bg-green-50 ml-auto">
          <Share2 size={18} />
        </Button>
      </div>
    </div>
  );
}