import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ProtectedLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#3b82f6' }}>
      
      <Tabs.Screen
        name="home/index" 
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="perfil/index" 
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />

    </Tabs>
  );
}