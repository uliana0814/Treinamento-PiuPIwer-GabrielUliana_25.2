import { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  Alert, 
  Platform 
} from "react-native";
import { Feather } from "@expo/vector-icons"; 
import { useAuth } from "~/contexts/AuthContext";

interface CreatePostProps {
  onPostCreated?: () => void; 
}

const API_URL = "http://localhost:3000"; 

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (content.trim().length < 3) {
      const msg = "O post precisa ter pelo menos 3 caracteres.";
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert("Atenção", msg);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Enviando post para:", `${API_URL}/api/posts`);

      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', 
        body: JSON.stringify({
          text: content,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${res.status}: Falha ao criar post`);
      }

      console.log("Post criado com sucesso!");
      setContent("");
      
      if (onPostCreated) {
        onPostCreated();
      }

    } catch (error) {
      console.error("Erro ao postar:", error);
      const msg = "Não foi possível publicar o post. Verifique sua conexão.";
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-6 border border-gray-200 shadow-sm">
      
      <TextInput
        className="w-full bg-gray-50 rounded-xl p-4 text-slate-700 text-base min-h-[100px]"
        placeholder={`No que você está pensando, ${user?.name?.split(' ')[0] || 'usuário'}?`}
        placeholderTextColor="#94a3b8"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        editable={!isLoading}
      />
      
      <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
        
        {/* Botão de Imagem (Visual) */}
        <TouchableOpacity 
          className="flex-row items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-200"
          disabled={isLoading}
          onPress={() => {
             if(Platform.OS === 'web') window.alert("Em breve!");
             else Alert.alert("Em breve", "Upload de imagem será implementado futuramente.");
          }}
        >
          <Feather name="image" size={18} color="#d97706" />
          <Text className="text-amber-700 font-medium text-sm ml-2">Imagem</Text>
        </TouchableOpacity>

        {/* Botão Publicar */}
        <TouchableOpacity 
          className={`flex-row items-center px-4 py-2 rounded-lg shadow-sm ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" className="mr-2" />
                <Text className="text-white font-bold text-sm">Enviando...</Text>
            </View>
          ) : (
            <>
              <Text className="text-white font-bold text-sm mr-2">Publicar</Text>
              <Feather name="send" size={16} color="white" />
            </>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}