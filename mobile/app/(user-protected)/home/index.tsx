import { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
} from "react-native";

import { useAuth } from "~/contexts/AuthContext"; 

// Imports dos Componentes
import MobileHomeCarousel from "~/components/MobileHomeCaroussel"; 
import { CreatePost } from "~/components/CreatePost"; 
import { PostCard } from "~/components/MobilePostCard";

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
  _count: {
    likes: number;
    comments: number;
  }
};

const API_URL = "http://localhost:3000"; 

// --- FUNÇÃO AUXILIAR DE TEMPO ---
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

export default function FeedScreen() {
  const { session } = useAuth(); 
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);

      console.log(`Buscando posts em: ${API_URL}/api/posts`);

      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Erro API: ${res.status}`);
      }

      const data = await res.json();
      setPosts(data.posts || []); 

    } catch (error) {
      console.error("Erro no fetch:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    <View className="flex-1 bg-gray-50"> 
      
      {loading && !refreshing && posts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          
          renderItem={({ item }) => {
            const avatarFullUrl = item.author.image?.startsWith("http") 
              ? item.author.image 
              : item.author.image ? `${API_URL}${item.author.image}` : null;

            return (
              <View className="px-4"> 
                <PostCard 
                  author={item.author.name}
                  handle={item.author.username}
                  time={formatTimeAgo(item.createdAt)}
                  content={item.text}
                  likes={item._count.likes}
                  comments={item._count.comments}
                  avatarUrl={avatarFullUrl}
                />
              </View>
            );
          }}
          
          ListHeaderComponent={() => (
            <View className="pt-4">
              <View className="px-4 mb-4">
                <Text className="text-xl font-bold text-slate-800">Destaques</Text>
              </View>
              
              <MobileHomeCarousel />
              
              <CreatePost onPostCreated={fetchPosts} />

              <View className="px-4 mb-2 mt-2">
                <Text className="text-xl font-bold text-slate-800">Seu Feed</Text>
              </View>
            </View>
          )}

          ListEmptyComponent={() => (
            <View className="py-10 items-center px-6">
              <Text className="text-gray-500 text-center mb-2">
                Seu feed está vazio ou não foi possível conectar.
              </Text>
              <Text className="text-xs text-gray-400 text-center">
                Verifique se o backend está rodando e se o IP ({API_URL}) está correto.
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