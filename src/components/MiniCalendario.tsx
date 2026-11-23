import React from 'react';
import { View } from 'react-native';
import { colors } from '@/theme';
import { HORA_FIN, HORA_INICIO } from '@/data/mock';
import { ClaseResuelta, resumenHorario } from '@/store';
import { Txt } from './ui';

const ANCHO = 128;
const PAD = 3;
const GAP = 2;
const FILA = 11;
const COL = (ANCHO - PAD * 2 - GAP * 4) / 5;

export function MiniCalendario({ n, clases }: { n: number; clases: ClaseResuelta[] }) {
  const { entrada, salida } = resumenHorario(clases);
  const desde = Math.min(HORA_INICIO, entrada);
  const hasta = Math.max(HORA_FIN, salida);
  const filas = hasta - desde;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Mini calendario de la opción ${n}, de ${entrada}:00 a ${salida}:00`}
      style={{ width: ANCHO, gap: 4 }}
    >
      <View style={{ flexDirection: 'row', gap: GAP, paddingHorizontal: PAD }}>
        {['L', 'M', 'X', 'J', 'V'].map((d) => (
          <Txt key={d} w="600" size={10} color={colors.text3} style={{ width: COL, textAlign: 'center' }}>{d}</Txt>
        ))}
      </View>
      <View style={{ height: filas * FILA + (filas - 1) * GAP + PAD * 2, borderRadius: 6, backgroundColor: colors.chip }}>
        {clases.flatMap((c) =>
          c.dias.map((d) => (
            <View
              key={`${c.materia.id}-${d}`}
              style={{
                position: 'absolute',
                left: PAD + (d - 1) * (COL + GAP),
                top: PAD + (c.hora - desde) * (FILA + GAP),
                width: COL,
                height: FILA,
                borderRadius: 2,
                backgroundColor: c.materia.color.bar,
              }}
            />
          )),
        )}
      </View>
      <Txt size={11} color={colors.text3}>{desde}:00 a {hasta}:00</Txt>
    </View>
  );
}
