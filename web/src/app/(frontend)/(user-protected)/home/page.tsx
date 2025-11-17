import HomeCaroussel from "./HomeCaroussel"; 
import { CreatePost } from "@/components/ui/CreatePost";
import { PostCard } from "@/components/ui/PostCard";
import { headers, cookies } from "next/headers"; 

type ApiPost = {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  likes: unknown[]; 
  comments: unknown[]; 
}

function formatTimeAgo(dateString: string) {
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

async function getPosts() {
  try {
    const host = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    
    const cookieStore = await cookies(); 
    
    const sessionCookie = cookieStore.get('better-auth.session-token'); 
    
    const fetchHeaders = new Headers();
    if (sessionCookie) {
      fetchHeaders.append('Cookie', `${sessionCookie.name}=${sessionCookie.value}`);
    }

    const res = await fetch(`${host}/api/posts`, {
      method: 'GET',
      headers: fetchHeaders, 
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error("Erro ao buscar posts (status):", res.status, res.statusText);
      throw new Error('Falha ao buscar posts');
    }

    const data = await res.json();

    return data as ApiPost[]; 
  
  } catch (error) {
    console.error("Erro detalhado ao buscar posts:", error);
    return []; 
  }
}

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
              handle={post.author.username ?? ''} 
              time={formatTimeAgo(post.createdAt)}
              content={post.text} 
              likes={post.likes.length} 
              comments={post.comments.length} 
              avatarUrl={post.author.image}
            />
          ))
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p>Seu feed está vazio. Siga alguém ou faça seu primeiro post!</p>
          </div>
        )}
      </div>
    </div>
  );
}