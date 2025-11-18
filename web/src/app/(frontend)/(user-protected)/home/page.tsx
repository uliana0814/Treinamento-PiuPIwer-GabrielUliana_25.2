import HomeCaroussel from "./HomeCaroussel";// (Verifique o caminho/nome deste arquivo)
import { CreatePost } from "@/components/ui/CreatePost";
import { PostCard } from "@/components/ui/PostCard";
import { cookies } from "next/headers"; // Para passar a autenticação

// 1. TIPO ATUALIZADO (para corresponder ao seu 'services/posts.ts')
type ApiPost = {
  id: string;
  text: string;
  createdAt: string; // O Prisma devolve como string de data
  author: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  _count: { // O seu backend envia _count
    likes: number;
    comments: number;
  }
}

// (Função formatTimeAgo)
function formatTimeAgo(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

// 2. FUNÇÃO getPosts CORRIGIDA
async function getPosts() {
  try {
    const host = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    
    // 3. CORREÇÃO do 'await' (o erro de Promise que vimos)
    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get('better-auth.session-token'); 
    
    const fetchHeaders = new Headers();
    if (sessionCookie) {
      fetchHeaders.append('Cookie', `${sessionCookie.name}=${sessionCookie.value}`);
    }

    const res = await fetch(`${host}/api/posts`, {
      method: 'GET',
      headers: fetchHeaders, 
      cache: 'no-store', // Essencial para o feed atualizar
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar posts');
    }

    const data = await res.json();
    
    // 4. CORREÇÃO da resposta (o seu backend devolve data.posts)
    return data.posts as ApiPost[]; 
  
  } catch (error) {
    console.error("Erro detalhado ao buscar posts:", error);
    return []; 
  }
}

// --- A PÁGINA ---
export default async function FeedPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-[700px] mx-auto pb-10">
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Destaques</h2>
        <HomeCaroussel /> 
      </div>

      <CreatePost />

      <h2 className="text-xl font-bold text-slate-800 mb-4 mt-8">Seu Feed</h2>
      <div className="flex flex-col gap-2">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              author={post.author.name}
              handle={post.author.username ?? ''} // Agora o 'username' existe!
              time={formatTimeAgo(post.createdAt)}
              content={post.text}
              // 5. CORREÇÃO da contagem (usando _count)
              likes={post._count.likes} 
              comments={post._count.comments} 
              avatarUrl={post.author.image} 
            />
          ))
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p>Seu feed está vazio. Faça seu primeiro post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
