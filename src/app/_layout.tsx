import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { StoreProvider } from '@/store';
import { colors } from '@/theme';

export default function RootLayout() {
  const [listas] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_700Bold,
    JetBrainsMono_700Bold,
  });
  if (!listas) return null;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reinscripcion" options={{ presentation: 'fullScreenModal', contentStyle: { backgroundColor: colors.night } }} />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
