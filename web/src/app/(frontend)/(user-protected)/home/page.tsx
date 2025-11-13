import CarouselExample from "@/frontend/(landing-pages)/_components/CarouselExample"; // Verifique o caminho/nome do seu carrossel
import { CreatePost } from "@/components/ui/CreatePost";
import { PostCard } from "@/components/ui/PostCard";

const fakePosts = [
  {
    id: 1,
    author: "Ana Silva",
    handle: "@anasilva",
    time: "2h atrás",
    content: "Acabei de lançar meu novo projeto! Depois de meses de trabalho, estou muito feliz em compartilhar isso com vocês. 🚀 #coding #webdev",
    likes: 124,
    comments: 12,
    color: "#2563EB" 
  },
  {
    id: 2,
    author: "Lucas Dev",
    handle: "@lucas_tech",
    time: "4h atrás",
    content: "Alguém mais tendo problemas com o deploy na Vercel hoje? Aqui tá dando erro de timeout toda hora.",
    likes: 45,
    comments: 8,
    color: "#EF4444" 
  },
  {
    id: 3,
    author: "Poli Júnior",
    handle: "@polijunior",
    time: "1d atrás",
    content: "O processo seletivo está aberto! Venha fazer parte da melhor EJ de engenharia. Inscrições no link da bio. 💙💛",
    likes: 890,
    comments: 56,
    color: "#EAB308"
  }
];

export default function FeedPage() {
  return (
    <div className="max-w-[700px] mx-auto pb-10">
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Destaques</h2>
        <CarouselExample />
      </div>

      <CreatePost />

      <h2 className="text-xl font-bold text-slate-800 mb-4 mt-8">Seu Feed</h2>
      <div className="flex flex-col gap-2">
        {fakePosts.map((post) => (
          <PostCard 
            key={post.id}
            author={post.author}
            handle={post.handle}
            time={post.time}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            color={post.color}
          />
        ))}
      </div>

    </div>
  );
}