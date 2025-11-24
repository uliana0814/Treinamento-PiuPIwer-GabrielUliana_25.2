import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";

const newsItems = [
  {
    category: "Entretenimento",
    title: "Lá vem festa!",
    description: "Festa de celebração de 10M de faturamento vem aí!",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT789I3S1dy7-EH1r0mU30HpAmKtv_FPmoPfA&s1", 
  },
  {
    category: "Esportes",
    title: "Sábado é guerra!",
    description: "Mengão se prepara para decisão.",
    imageUrl: "https://s2-oglobo.glbimg.com/IyxzE2syOh_33DkoU4_kZl_8bPw=/540x304/top/smart/https://i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2025/Z/s/oAHST3Q6A1PHzO48OXbg/113101478-es-rio-de-janeiro-rj-22-11-2025-campeonato-brasileiro-2025-35a-rodada.-flame.jpg",
  },
  {
    category: "Mundo coorporativo",
    title: "Poli Júnior alcança 10M de faturamento!",
    description: "Por mais um ano, a maior EJ do Brasil alcança marca histórica.",
    imageUrl: "https://polijunior.com.br/wp-content/uploads/2024/02/Logo-Poli-Site.jpeg",
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