import React from 'react';
import { View } from 'react-native';
import { colors } from '@/theme';
import { Encabezado, Titulo, Txt } from '@/components/ui';

/** Pestañas que aparecen en la barra pero aún no tienen mockup. */
export function Pendiente({ titulo, detalle, children }: { titulo: string; detalle: string; children?: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Encabezado>
        <Titulo>{titulo}</Titulo>
        <Txt size={12} color={colors.text3}>Pantalla pendiente de diseño</Txt>
      </Encabezado>
      <View style={{ padding: 16, gap: 16 }}>
        <Txt color={colors.text2}>{detalle}</Txt>
        {children}
      </View>
    </View>
  );
}
