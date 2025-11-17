import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/ui/PostCard"
import { 
  Pencil, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  BarChart2, 
  FileText, 
  FileImage, 
  Activity
} from "lucide-react"

const fakeUser = {
  name: "Seu Nome",
  handle: "@seunome",
  bio: "Apaixonado por tecnologia e inovação. Compartilhando ideias e aprendizados sobre desenvolvimento web e design.",
  location: "São Paulo, Brasil",
  joined: "Janeiro 2024",
  website: "website.com",
  followers: 2500,
  following: 892,
  avatarUrl: "https://ui-avatars.com/api/?name=Seu+Nome&background=random&color=fff&size=128"
};

const userPosts = [
  {
    id: 1,
    author: "Seu Nome",
    handle: "@seunome",
    time: "1d atrás",
    content: "Compartilhando minha jornada de aprendizado em desenvolvimento web. Cada dia é uma nova oportunidade! 💻",
    likes: 142,
    comments: 28,
    color: "#3B82F6"
  },
  {
    id: 2,
    author: "Seu Nome",
    handle: "@seunome",
    time: "2d atrás",
    content: "Pensamento do dia: A persistência é o caminho do êxito. Continue trabalhando duro nos seus sonhos! ✨",
    likes: 98,
    comments: 15,
    color: "#3B82F6"
  }
];

function StatCard({ title, value, icon: Icon, change }: { title: string, value: string, icon: React.ElementType, change: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between text-slate-400 mb-1">
        <span className="text-sm font-medium">{title}</span>
        <Icon size={18} />
      </div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-green-500 font-medium">{change}</p>
    </div>
  )
}


export default function ProfilePage() {
  return (
    <div className="max-w-[900px] mx-auto pb-10">
      
      <div className="h-40 w-full bg-linear-to-r from-blue-400 to-blue-600 rounded-t-2xl shadow-sm">
      </div>

      <div className="bg-white rounded-b-2xl p-6 shadow-sm border border-t-0 border-slate-100 mb-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          
          <div className="-mt-20 relative">
             <img 
                src={fakeUser.avatarUrl}
                alt={fakeUser.name}
                className="w-32 h-32 rounded-full border-[5px] border-white shadow-md object-cover bg-white"
              />
          </div>
          
          <Button variant="outline" className="mt-4 sm:mt-0 font-semibold border-slate-300">
            <Pencil size={16} /> Editar Perfil
          </Button>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900">{fakeUser.name}</h1>
          <p className="text-sm text-slate-500">{fakeUser.handle}</p>
          <p className="text-slate-700 my-3 leading-relaxed">{fakeUser.bio}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mt-4">
          <span className="flex items-center gap-1.5"><MapPin size={16} /> {fakeUser.location}</span>
          <span className="flex items-center gap-1.5"><Calendar size={16} /> Entrou em {fakeUser.joined}</span>
          <a href="#" className="flex items-center gap-1.5 text-blue-600 hover:underline"><LinkIcon size={16} /> {fakeUser.website}</a>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
          <span className="font-semibold">{fakeUser.followers.toLocaleString('pt-BR')}</span> Seguidores
          <span className="font-semibold ml-2">{fakeUser.following.toLocaleString('pt-BR')}</span> Seguindo
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total de Posts" value="127" icon={FileText} change="+12% vs. mês passado" />
        <StatCard title="Seguidores" value="2.5K" icon={Users} change="+18% vs. mês passado" />
        <StatCard title="Posts com Imagem" value="89" icon={FileImage} change="+5% vs. mês passado" />
        <StatCard title="Engajamento" value="8.2K" icon={Activity} change="+23% vs. mês passado" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Seus Posts</h2>
        <div className="flex flex-col gap-4">
          {userPosts.map((post) => (
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

    </div>
  )
}