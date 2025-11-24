import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";

const newsItems = [
  {
    category: "Tecnologia",
    title: "Nova atualização traz recursos inovadores",
    description: "Confira as novidades que chegaram hoje na plataforma.",
    imageUrl: "https://placehold.co/1200x500/1E293B/E2E8F0?text=Notícia+1", 
  },
  {
    category: "Esportes",
    title: "Final do campeonato é definida",
    description: "Times se preparam para o grande confronto no próximo fim de semana.",
    imageUrl: "https://placehold.co/1200x500/166534/E2E8F0?text=Notícia+2",
  },
  {
    category: "Comunidade",
    title: "PiuPiwer celebra 1 milhão de usuários!",
    description: "Nossa comunidade atingiu uma nova marca histórica esta semana.",
    imageUrl: "https://placehold.co/1200x500/0891B2/E2E8F0?text=Notícia+3",
  }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MobileHomeCarousel() {
  return (
    <View className="mb-6">
      <FlatList
        data={newsItems}
        horizontal
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH - 32 }} className="mr-4 h-64 rounded-2xl overflow-hidden relative mx-4">
            
            <Image 
              source={{ uri: item.imageUrl }} 
              className="w-full h-full absolute"
              resizeMode="cover"
            />

            <View className="absolute inset-0 bg-black/50 justify-end p-4">
              
              <Text className="text-xs font-bold text-white/90 uppercase tracking-wide mb-1">
                {item.category}
              </Text>
              
              <Text className="text-xl font-bold text-white mb-2 leading-6">
                {item.title}
              </Text>
              
              <Text className="text-sm text-white/80 line-clamp-2 mb-4">
                {item.description}
              </Text>

              <TouchableOpacity className="bg-amber-400 py-2 px-4 rounded-lg self-start">
                <Text className="text-amber-900 font-bold text-sm">
                  Ler mais
                </Text>
              </TouchableOpacity>
            
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 0 }} 
        snapToInterval={SCREEN_WIDTH - 32 + 16} 
        decelerationRate="fast"
      />
    </View>
  );
}