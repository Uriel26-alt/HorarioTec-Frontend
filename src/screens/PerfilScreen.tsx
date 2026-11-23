import React from 'react';
import { Switch, View } from 'react-native';
import { colors } from '@/theme';
import { useStore } from '@/store';
import { tarjeta, Txt } from '@/components/ui';
import { Pendiente } from './Pendiente';

export default function PerfilScreen() {
  const { sinCombinaciones, setSinCombinaciones } = useStore();
  return (
    <Pendiente titulo="Perfil" detalle="Aquí irán tus datos de carrera, semestre y sesión.">
      <View style={[tarjeta, { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt w="700">Demo: horarios sin combinaciones</Txt>
          <Txt size={12} color={colors.text3}>
            Muestra el estado vacío de la pestaña Horarios mientras no exista el generador real.
          </Txt>
        </View>
        <Switch
          accessibilityLabel="Simular horarios sin combinaciones"
          value={sinCombinaciones}
          onValueChange={setSinCombinaciones}
          trackColor={{ true: colors.ink, false: colors.borderMid }}
        />
      </View>
    </Pendiente>
  );
}
