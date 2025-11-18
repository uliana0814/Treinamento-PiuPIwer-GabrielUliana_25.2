import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/ui/PostCard" // O seu componente de card
import { 
  Pencil, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  FileText, 
  Activity
} from "lucide-react"
import { auth } from "@/auth" // Para pegar a sessão do utilizador
import { headers } from "next/headers" // Para passar para a sessão
import { getPostsByUserId } from "@/backend/services/posts" // A sua função do backend!
import prisma from "@/app/(backend)/services/db" // Para buscar os 'counts'

// 1. Tipos de dados (SEM BIO, SEM USERNAME)
type ProfileData = {
  id: string;
  name: string;
  image: string | null;
  location: string | null;
  createdAt: Date; 
  _count: {
    posts: number;
    followers: number;
    following: number;
  }
}

// 2. O tipo de post (SEM USERNAME no autor)
type UserPost = {
  id: string;
  text: string;
  createdAt: Date;
  author: {
    id: string; 
    name: string;
    email: string; 
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

// (Função formatTimeAgo copiada da Home)
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

// Função para buscar os dados do Perfil
async function getProfileData() {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session?.user?.id) return null 

  try {
    const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // bio: false, // Removido
          location: true,
          createdAt: true,
          _count: { 
            select: { 
              posts: true, 
              followers: true, 
              following: true 
            },
          },
        },
      });
    
    return userProfile as ProfileData | null;

  } catch (error) {
    console.error("Erro ao buscar dados do perfil:", error);
    return null;
  }
}

// Componente do Card de Estatística
function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between text-slate-400 mb-1">
        <span className="text-sm font-medium">{title}</span>
        <Icon size={18} />
      </div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  )
}

// --- A PÁGINA DE PERFIL ---
export default async function ProfilePage() {
  // 1. Buscamos os dados reais do perfil
  const profileData = await getProfileData();
  
  // 2. Buscamos os posts reais do perfil
  let userPosts: UserPost[] = [];
  if (profileData?.id) {
    const postsData = await getPostsByUserId(profileData.id);
    userPosts = postsData.posts as UserPost[]; 
  }
  
  const avatarFallback = `https://ui-avatars.com/api/?name=${profileData?.name || 'User'}&background=random&color=fff&size=128`;
  const avatarUrl = profileData?.image || avatarFallback;

  // --- AQUI ESTÁ A CORREÇÃO ---
  // Criamos o @handle fictício a partir do nome
  // Transforma "Gabriel Uliana" -> "GabrielUliana"
  const fakeHandle = profileData?.name ? profileData.name.replace(/\s+/g, '') : 'utilizador';

  return (
    <div className="max-w-[900px] mx-auto pb-10">
      
      {/* --- 1. CAPA --- */}
      <div className="h-40 w-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl shadow-sm" />

      {/* --- 2. CARTÃO DE PERFIL --- */}
      <div className="bg-white rounded-b-2xl p-6 shadow-sm border border-t-0 border-slate-100 mb-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="-mt-20 relative">
             {/* Usamos <img> para evitar o erro de config do Next.js */}
             <img 
                src={avatarUrl}
                alt={profileData?.name || 'Avatar'}
                className="w-32 h-32 rounded-full border-[5px] border-white shadow-md object-cover bg-white"
              />
          </div>
          <Button variant="outline" className="mt-4 sm:mt-0 font-semibold border-slate-300">
            <Pencil size={16} /> Editar Perfil
          </Button>
        </div>

        {/* Informações (COM O @handle fictício) */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900">{profileData?.name || "Carregando..."}</h1>
          {/* --- AQUI ESTÁ A MUDANÇA --- */}
          <p className="text-sm text-slate-500">@{fakeHandle}</p>
        </div>

        {/* Metadados (Localização, Data, etc) */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
          {profileData?.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {profileData.location}</span>}
          {profileData?.createdAt && <span className="flex items-center gap-1.5"><Calendar size={16} /> Entrou em {new Date(profileData.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>}
          {/* <a href="#" className="flex items-center gap-1.5 text-blue-600 hover:underline"><LinkIcon size={16} /> website.com</a> */}
        </div>

        {/* Seguidores */}
        <div className="flex items-center gap-4 text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
          <span className="font-semibold">{profileData?._count.followers || 0}</span> Seguidores
          <span className="font-semibold ml-2">{profileData?._count.following || 0}</span> Seguindo
        </div>
      </div>

      {/* 2. Estatísticas Básicas (Dados reais) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total de Posts" value={profileData?._count.posts || 0} icon={FileText} />
        <StatCard title="Seguidores" value={profileData?._count.followers || 0} icon={Users} />
        <StatCard title="Seguindo" value={profileData?._count.following || 0} icon={Users} />
        <StatCard title="Engajamento" value="0" icon={Activity} />
      </div>

      {/* 3. Lista de Posts do Utilizador (Dados reais) */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Seus Posts</h2>
        <div className="flex flex-col gap-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard 
                key={post.id}
                author={post.author.name}
                // handle não é mais passado, pois o PostCard já o gera
                time={formatTimeAgo(post.createdAt)}
                content={post.text}
                likes={post._count.likes} 
                comments={post._count.comments} 
                avatarUrl={post.author.image}
              />
            ))
          ) : (
            <p className="text-center text-slate-500 py-10">Você ainda não fez nenhum post.</p>
          )}
        </div>
      </div>
    </div>
  )
}