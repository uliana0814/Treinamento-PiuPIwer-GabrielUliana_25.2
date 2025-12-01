import { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Alert,
  Platform
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "~/contexts/AuthContext";
import { PostCard } from "~/components/MobilePostCard"; 

type ProfileData = {
  id: string;
  name: string;
  image: string | null;
  location: string | null;
  createdAt: string; 
  _count: {
    posts: number;
    followers: number;
    following: number;
  }
}

type UserPost = {
  id: string;
  text: string;
  createdAt: string;
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

const API_URL = "http://192.168.15.9:3000"; 

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

const StatCard = ({ title, value, iconName }: { title: string, value: string | number, iconName: keyof typeof Feather.glyphMap }) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 min-w-[45%] mb-3 mr-2">
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-xs font-medium text-gray-400">{title}</Text>
      <Feather name={iconName} size={16} color="#9ca3af" />
    </View>
    <Text className="text-2xl font-bold text-slate-800">{value}</Text>
  </View>
);

export default function ProfileScreen() {
  const { user, session, signOut } = useAuth(); 
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;

    if (!session?.token) {
        console.log("Aguardando token de sessão...");
        return; 
    }

    try {
      if (!refreshing) setLoading(true);

      const authHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://192.168.15.9:3000', 
        'Cookie': `better-auth.session_token=${session.token}`
      };

      const profileEndpoint = `${API_URL}/api/users/${user.id}`;
      console.log("Buscando perfil em:", profileEndpoint);

      const resProfile = await fetch(profileEndpoint, {
        method: 'GET',
        headers: authHeaders,
        credentials: 'include'
      });

      if (resProfile.ok) {
        const data = await resProfile.json();
        setProfileData(data); 
      } else {
        const errorText = await resProfile.text().catch(() => "Sem detalhes");
        console.warn(`ERRO API PERFIL (${resProfile.status}):`, errorText);
        
        setProfileData({
            id: user.id,
            name: user.name || "Usuário",
            image: user.image || null,
            location: "Brasil",
            createdAt: new Date().toISOString(),
            _count: { posts: 0, followers: 0, following: 0 }
        });
      }

      const postsEndpoint = `${API_URL}/api/users/${user.id}/posts`; 
      
      const resPosts = await fetch(postsEndpoint, {
        method: 'GET',
        headers: authHeaders,
        credentials: 'include'
      });
      
      if (resPosts.ok) {
        const postsData = await resPosts.json();
        const posts = postsData.posts || postsData || []; 
        setUserPosts(posts);
        
        setProfileData(prev => prev ? ({
            ...prev,
            _count: { ...prev._count, posts: posts.length }
        }) : null);
      } else {
        console.error(`Erro Posts (${resPosts.status})`);
      }

    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing, user?.id, session?.token]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const avatarFullUrl = profileData?.image?.startsWith("http") 
    ? profileData?.image 
    : profileData?.image ? `${API_URL}${profileData?.image}` : `https://ui-avatars.com/api/?name=${profileData?.name || 'User'}&background=random&color=fff&size=128`;

  const fakeHandle = profileData?.name ? profileData.name.replace(/\s+/g, '').toLowerCase() : 'usuario';

  return (
    <View className="flex-1 bg-gray-50">
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
             const postAvatarUrl = item.author.image?.startsWith("http") 
             ? item.author.image 
             : item.author.image ? `${API_URL}${item.author.image}` : null;

             return (
              <View className="px-4">
                <PostCard 
                  author={item.author.name}
                  handle={null}
                  time={formatTimeAgo(item.createdAt)}
                  content={item.text}
                  likes={item._count.likes}
                  comments={item._count.comments}
                  avatarUrl={postAvatarUrl}
                />
              </View>
             )
          }}
          
          ListHeaderComponent={() => (
            <View>
              <View className="h-32 w-full bg-blue-500 rounded-b-3xl relative">
                 <TouchableOpacity 
                    onPress={signOut}
                    className="absolute top-4 right-4 bg-white/20 p-2 rounded-full z-10"
                 >
                    <Feather name="log-out" size={20} color="white" />
                 </TouchableOpacity>
              </View>

              <View className="px-4">
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 -mt-12 mb-6">
                  <View className="flex-row justify-between items-start">
                    <View className="-mt-10">
                      <Image 
                        source={{ uri: avatarFullUrl }}
                        className="w-24 h-24 rounded-full border-4 border-white bg-gray-200"
                      />
                    </View>
                    <TouchableOpacity 
                      className="mt-2 border border-gray-300 px-3 py-1.5 rounded-full flex-row items-center"
                      onPress={() => {
                        if(Platform.OS === 'web') window.alert("Em breve!");
                        else Alert.alert("Editar", "Em breve!");
                      }}
                    >
                      <Feather name="edit-2" size={14} color="#475569" />
                      <Text className="text-slate-600 text-xs font-bold ml-1">Editar</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mt-3">
                    <Text className="text-2xl font-bold text-slate-900">{profileData?.name}</Text>
                    <Text className="text-slate-500 text-sm">@{fakeHandle}</Text>
                  </View>

                  <View className="flex-row flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                    {profileData?.location && (
                        <View className="flex-row items-center">
                        <Feather name="map-pin" size={14} color="#94a3b8" />
                        <Text className="text-slate-500 text-xs ml-1">{profileData.location}</Text>
                        </View>
                    )}
                    <View className="flex-row items-center">
                      <Feather name="calendar" size={14} color="#94a3b8" />
                      <Text className="text-slate-500 text-xs ml-1">
                        Entrou em {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "..."}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row mt-4 gap-4">
                    <Text className="text-slate-600 text-sm"><Text className="font-bold text-slate-900">{profileData?._count.followers || 0}</Text> Seguidores</Text>
                    <Text className="text-slate-600 text-sm"><Text className="font-bold text-slate-900">{profileData?._count.following || 0}</Text> Seguindo</Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap justify-between mb-6">
                  <StatCard title="Posts" value={profileData?._count.posts || 0} iconName="file-text" />
                  <StatCard title="Seguidores" value={profileData?._count.followers || 0} iconName="users" />
                  <StatCard title="Seguindo" value={profileData?._count.following || 0} iconName="user-check" />
                  <StatCard title="Engajamento" value="-" iconName="activity" />
                </View>

                <Text className="text-xl font-bold text-slate-800 mb-4">Seus Posts</Text>
              </View>
            </View>
          )}

          ListEmptyComponent={() => (
            <View className="py-10 items-center px-6">
              <Text className="text-gray-500 text-center mb-4">
                Você ainda não fez nenhum post.
              </Text>
            </View>
          )}

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}