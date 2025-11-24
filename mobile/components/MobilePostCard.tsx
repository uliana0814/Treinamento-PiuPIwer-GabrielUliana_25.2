import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; 

interface PostProps {
  author: string;
  handle?: string | null;
  time: string;
  content: string;
  likes: number;
  comments: number;
  avatarUrl: string | null | undefined;
}

export function PostCard({ 
  author, 
  handle, 
  time, 
  content, 
  likes, 
  comments, 
  avatarUrl 
}: PostProps) {
  
  const displayHandle = handle || author.replace(/\s+/g, '').toLowerCase();

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-4">
      
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }}
              className="w-10 h-10 rounded-full bg-gray-200"
              resizeMode="cover"
            />
          ) : (
            <View className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 shadow-sm">
              <Text className="text-white font-bold text-base">
                {author.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <View className="flex-1">
            <Text className="font-bold text-slate-900 text-base">{author}</Text>
            <Text className="text-xs text-gray-500">@{displayHandle} • {time}</Text>
          </View>
        </View>
        
        <TouchableOpacity className="p-1">
          <Feather name="more-horizontal" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <Text className="text-slate-700 text-[15px] mb-4 leading-6">
        {content}
      </Text>

      <View className="flex-row items-center gap-6 pt-3 border-t border-gray-100">
        
        <TouchableOpacity className="flex-row items-center p-1">
          <Feather name="heart" size={18} color="#64748b" />
          <Text className="ml-2 text-xs font-medium text-slate-500">{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-1">
          <Feather name="message-circle" size={18} color="#64748b" />
          <Text className="ml-2 text-xs font-medium text-slate-500">{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="ml-auto p-1">
          <Feather name="share-2" size={18} color="#64748b" />
        </TouchableOpacity>

      </View>
    </View>
  );
}