import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="materias" options={{ title: 'Materias' }} />
      <Tabs.Screen name="horarios" options={{ title: 'Horarios' }} />
      <Tabs.Screen name="planes" options={{ title: 'Planes' }} />
      <Tabs.Screen name="en-vivo" options={{ title: 'En vivo' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
