import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "~/contexts/AuthContext";

export default function CadastroScreen() {
  const router = useRouter();
  const { signUp } = useAuth(); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasMinLength) {
      Alert.alert("Erro", "A senha não atende aos requisitos mínimos.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password, name);

      if (result?.error) {
         Alert.alert("Erro no Cadastro", result.error);
      } else {
         Alert.alert("Sucesso", `Bem-vindo(a), ${name}!`, [
            { 
              text: "Ir para Home", 
              onPress: () => router.replace("/home")
            } 
         ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const RequirementItem = ({ fulfilled, text }: { fulfilled: boolean, text: string }) => (
    <View className="flex-row items-center mb-1">
      <View className={`w-2 h-2 rounded-full mr-2 ${fulfilled ? 'bg-green-500' : 'bg-gray-300'}`} />
      <Text className={`${fulfilled ? 'text-green-600' : 'text-gray-500'} text-sm`}>
        {text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-blue-500"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        
        <View className="bg-white p-6 rounded-2xl shadow-md w-full items-center">
          
          <Image 
            source={require("../../../assets/icon.png")} 
          style={{ width: 48, height: 48, marginBottom: 16 }} 
          resizeMode="contain"
          />

          <Text className="font-bold text-3xl text-center text-slate-900 mb-8">
            Conectando a comunidade Poli!
          </Text>

          <View className="space-y-4 w-full">
            
            <View>
              <Text className="text-slate-700 font-semibold mb-1 ml-1">Nome</Text>
              <TextInput
                placeholder="Insira seu nome completo"
                value={name}
                onChangeText={setName}
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-1 ml-1">E-mail</Text>
              <TextInput
                placeholder="exemplo@piupiwer.com.br"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-1 ml-1">Senha</Text>
              <TextInput
                placeholder="Insira sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-slate-700 font-semibold mb-1 ml-1">Confirmar Senha</Text>
              <TextInput
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-slate-800"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View className="mt-2 p-3 bg-gray-50 rounded-lg w-full">
              <Text className="text-xs text-gray-500 mb-2 font-bold uppercase">A senha deve ter:</Text>
              <RequirementItem fulfilled={hasUpperCase} text="1 letra maiúscula" />
              <RequirementItem fulfilled={hasLowerCase} text="1 letra minúscula" />
              <RequirementItem fulfilled={hasNumber} text="1 número" />
              <RequirementItem fulfilled={hasMinLength} text="Pelo menos 8 caracteres" />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`w-full h-14 justify-center items-center rounded-full mt-4 ${
                loading ? "bg-blue-300" : "bg-blue-500"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">Cadastrar</Text>
              )}
            </TouchableOpacity>

          </View>

          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-sm text-gray-500">
              Já tem uma conta?{" "}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-sm text-blue-500 font-bold ml-1">
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}