import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { colors } from '@/theme';
import { Icon, IconName } from './Icon';
import { Txt } from './ui';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONOS: Record<string, IconName> = {
  materias: 'materias',
  horarios: 'horarios',
  planes: 'planes',
  'en-vivo': 'enVivo',
  perfil: 'perfil',
};

export function TabBar({ state, descriptors, emitter, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View accessibilityRole="tablist" style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, i) => {
        const activo = state.index === i;
        const titulo = String(descriptors[route.key].options.title ?? route.name);
        const color = activo ? colors.primary : colors.text3;
        const onPress = () => {
          const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!activo && !e.defaultPrevented) navigateToTab(route.key);
        };
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={titulo}
            onPress={onPress}
            style={styles.tab}
          >
            <Icon name={ICONOS[route.name] ?? 'materias'} color={color} />
            <Txt w={activo ? '700' : '600'} size={11} color={color}>{titulo}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  tab: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 3 },
});
