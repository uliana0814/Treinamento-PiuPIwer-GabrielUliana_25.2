import { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert, 
  ActivityIndicator, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useAuth } from "~/contexts/AuthContext";
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter(); 
  const { signIn, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
    console.log("1. Botão clicado. Iniciando login...");
    
    if (!email || !password) {
      console.log("Campo vazio detectado");
      if (Platform.OS === 'web') {
        window.alert("Por favor, preencha todos os campos");
      } else {
        Alert.alert("Erro", "Por favor, preencha todos os campos");
      }
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("2. Enviando dados para o AuthContext:", email);
      const result = await signIn(email, password);
      console.log("3. Resultado recebido:", result);

      if (result.success) {
        console.log("4. Sucesso! Redirecionando para /home");
        router.replace("/home");
      } else {
        console.error("4. Erro no Login:", result.error);
        
        if (Platform.OS === 'web') {
          window.alert(`Falha no Login: ${result.error || "Verifique suas credenciais"}`);
        } else {
          Alert.alert("Falha no Login", result.error || "Verifique suas credenciais");
        }
      }
    } catch (error) {
      console.error("ERRO CRÍTICO NO LOGIN:", error);
    } finally {
      setIsLoading(false);
      console.log("5. Finalizou loading");
    }
  };


  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="px-6 justify-center">
          <View className="items-center mb-10">
            <Image 
              source={require("../../../assets/icon.png")} 
              style={{ width: 48, height: 48, marginBottom: 16 }} 
              resizeMode="contain"
            />
            <Text className="text-3xl font-extrabold text-slate-900 text-center">
              Entrar no PiuPiwer
            </Text>
          </View>
          
          <View className="space-y-4">
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
              placeholderTextColor="#94a3b8"
            />
            
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`w-full h-14 justify-center items-center rounded-full mt-2 ${
                isLoading ? "bg-blue-300" : "bg-blue-500"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
          </View> 

          <View className="mt-10 flex-row justify-center items-center">
            <Text className="text-sm text-gray-500">
              Ainda não tem uma conta?{" "}
            </Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text className="text-sm text-blue-500 font-bold ml-1">
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}