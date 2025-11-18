import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; 

interface PostProps {
  author: string;
  handle?: string; // (Continuamos a ignorar isto)
  time: string;
  content: string;
  likes: number;
  comments: number;
  avatarUrl: string | null | undefined; 
}

export function PostCard({ 
  author, 
  handle, // (Ignorado)
  time, 
  content, 
  likes, 
  comments, 
  avatarUrl 
}: PostProps) {
  
  const fakeHandle = author.replace(/\s+/g, '');

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          
          {avatarUrl ? (
            <Image 
              src={avatarUrl}
              alt={author}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm bg-blue-500">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="leading-tight">
            <h3 className="font-bold text-slate-900">{author}</h3>
            <span className="text-xs text-slate-500">@{fakeHandle} • {time}</span>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="text-slate-400">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      <p className="text-slate-700 leading-relaxed text-[15px] mb-4">
        {content}
      </p>

      <div className="flex items-center gap-1 pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500 group hover:bg-red-50">
          <Heart size={18} />
          <span className="ml-1 text-xs font-medium">{likes}</span>
        </Button>

        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 group hover:bg-blue-50">
          <MessageCircle size={18} />
          <span className="ml-1 text-xs font-medium">{comments}</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-green-500 group hover:bg-green-50 ml-auto">
          <Share2 size={18} />
        </Button>
      </div>
    </div>
  );
}