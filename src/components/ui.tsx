import React from 'react';
import { Alert, Pressable, StyleProp, StyleSheet, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, riesgo as RIESGO, Riesgo } from '@/theme';
import { Icon } from './Icon';

type Peso = '400' | '500' | '600' | '700' | 'display' | 'mono';
const FAMILIA: Record<Peso, string> = {
  '400': fonts.regular,
  '500': fonts.medium,
  '600': fonts.semibold,
  '700': fonts.bold,
  display: fonts.display,
  mono: fonts.mono,
};

type TxtProps = TextProps & { w?: Peso; size?: number; color?: string; lh?: number; style?: StyleProp<TextStyle> };

/** Texto base: Inter 14 con el interlineado de los mockups. */
export function Txt({ w = '400', size = 14, color = colors.ink, lh = 1.35, style, ...rest }: TxtProps) {
  return <Text {...rest} style={[{ fontFamily: FAMILIA[w], fontSize: size, color, lineHeight: Math.round(size * lh) }, style]} />;
}

export function Badge({ label, bg, fg, style }: { label: string; bg: string; fg: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Txt w="700" size={12} color={fg}>{label}</Txt>
    </View>
  );
}

export function RiesgoBadge({ nivel, corto, punto }: { nivel: Riesgo; corto?: boolean; punto?: boolean }) {
  const r = RIESGO[nivel];
  return (
    <View style={[styles.badge, punto && styles.badgePunto, { backgroundColor: r.bg }]}>
      {punto && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: r.fg }} />}
      <Txt w="700" size={12} color={r.fg}>{corto ? r.corto : r.largo}</Txt>
    </View>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  return <Badge label={`Plan ${plan}`} bg={colors.ink} fg="#FFFFFF" />;
}

type BotonProps = {
  label: string;
  onPress?: () => void;
  variante?: 'primario' | 'contorno';
  alto?: number;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Boton({ label, onPress, variante = 'primario', alto = 52, size = 14, disabled, style }: BotonProps) {
  const primario = variante === 'primario';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.boton,
        { height: alto, backgroundColor: primario ? colors.ink : colors.surface },
        !primario && { borderWidth: 1.5, borderColor: colors.ink },
        disabled && { backgroundColor: colors.borderMid, borderColor: colors.borderMid },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Txt w="700" size={size} color={disabled ? colors.text2 : primario ? '#FFFFFF' : colors.ink}>{label}</Txt>
    </Pressable>
  );
}

/** Encabezado blanco de pantalla; respeta el área segura superior. */
export function Encabezado({ children, atras }: { children: React.ReactNode; atras?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.encabezado, { paddingTop: insets.top + (atras ? 8 : 20), gap: atras ? 2 : 4 }]}>
      {atras && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Volver a ${atras}`} onPress={() => router.back()} style={styles.atras}>
          <Icon name="atras" size={18} color={colors.primary} strokeWidth={2.5} />
          <Txt w="600" size={13} color={colors.primary}>{atras}</Txt>
        </Pressable>
      )}
      {children}
    </View>
  );
}

export function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <Txt accessibilityRole="header" w="display" size={24} lh={1.25} style={{ letterSpacing: -0.24 }}>{children}</Txt>
  );
}

/** Barra de acción fija sobre la barra de pestañas. */
export function BarraInferior({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.barraInferior, style]}>{children}</View>;
}

/** Para acciones cuya pantalla todavía no está diseñada. */
export function pendiente(que: string) {
  Alert.alert(que, 'Esta parte todavía no tiene mockup; queda pendiente.');
}

export const tarjeta: ViewStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 10,
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgePunto: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3, alignSelf: 'flex-start' },
  boton: { alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 16 },
  encabezado: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  atras: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44, alignSelf: 'flex-start' },
  barraInferior: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
