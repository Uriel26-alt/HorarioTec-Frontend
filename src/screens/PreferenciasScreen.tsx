import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { colors } from '@/theme';
import { PREFERENCIAS, PRESETS } from '@/data/mock';
import { useStore } from '@/store';
import { Icon } from '@/components/Icon';
import { BarraInferior, Boton, Encabezado, pendiente, tarjeta, Titulo, Txt } from '@/components/ui';

const nivel = (n: number) => (n >= 70 ? 'Alto' : n >= 40 ? 'Medio' : n > 0 ? 'Bajo' : 'Nulo');

export default function PreferenciasScreen() {
  const { seleccion, creditos, preset, pesos, elegirPreset, cambiarPeso, bloqueos, quitarBloqueo, vetados, quitarVeto } = useStore();

  return (
    <View style={styles.pantalla}>
      <Encabezado atras="Materias">
        <Titulo>Preferencias</Titulo>
        <Txt size={12} color={colors.text3}>
          {seleccion.length} {seleccion.length === 1 ? 'materia' : 'materias'} · {creditos} créditos
        </Txt>
      </Encabezado>

      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={{ gap: 6 }}>
          <Txt accessibilityRole="header" w="600" size={12} color={colors.text2}>Empieza con un preset</Txt>
          <View style={styles.presets}>
            {PRESETS.map((p) => {
              const on = preset === p.id;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => elegirPreset(p.id)}
                  style={[styles.preset, on && styles.presetOn]}
                >
                  <Txt w="600" size={13} color={on ? '#FFFFFF' : colors.ink}>{p.label}</Txt>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[tarjeta, { overflow: 'hidden' }]}>
          <View style={styles.cabezaOscura}>
            <Txt accessibilityRole="header" w="display" size={16} color="#FFFFFF">Obligatorio</Txt>
            <Txt size={12} color={colors.borderMid}>Ningún horario generado rompe estas reglas.</Txt>
          </View>

          <View style={[styles.bloque, styles.divisor]}>
            <Txt accessibilityRole="header" w="700" size={13}>Bloqueos de horario</Txt>
            {bloqueos.map((b) => (
              <View key={b.id} style={styles.bloqueo}>
                <View style={{ flex: 1 }}>
                  <Txt w="600">{b.rango}</Txt>
                  <Txt size={12} color={colors.text3}>{b.motivo}</Txt>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar bloqueo de ${b.motivo.toLowerCase()}`}
                  onPress={() => quitarBloqueo(b.id)}
                  style={styles.toque}
                >
                  <Icon name="cerrar" size={18} color={colors.text3} strokeWidth={2.5} />
                </Pressable>
              </View>
            ))}
            <Pressable accessibilityRole="button" onPress={() => pendiente('Agregar bloqueo')} style={styles.agregar}>
              <Txt w="600">+ Agregar bloqueo</Txt>
            </Pressable>
          </View>

          <View style={styles.bloque}>
            <Txt accessibilityRole="header" w="700" size={13}>Profesores vetados</Txt>
            <View style={styles.vetados}>
              {vetados.map((nombre) => (
                <Pressable
                  key={nombre}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar veto a ${nombre}`}
                  onPress={() => quitarVeto(nombre)}
                  style={styles.vetado}
                >
                  <Txt w="600">{nombre}</Txt>
                  <Icon name="cerrar" size={14} color={colors.ink} strokeWidth={3} />
                </Pressable>
              ))}
              <Pressable accessibilityRole="button" onPress={() => pendiente('Agregar profesor vetado')} style={[styles.agregar, styles.agregarChip]}>
                <Txt w="600">+ Agregar</Txt>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[tarjeta, { overflow: 'hidden' }]}>
          <View style={styles.cabezaClara}>
            <Txt accessibilityRole="header" w="display" size={16}>Preferible</Txt>
            <Txt size={12} color={colors.text3}>Suben o bajan el puntaje. El peso indica cuánto te importa.</Txt>
          </View>
          {PREFERENCIAS.map((f, i) => (
            <View key={f.id} style={[styles.pref, i < PREFERENCIAS.length - 1 && styles.divisor]}>
              <View style={styles.filaPref}>
                <Txt w="600">{f.label}</Txt>
                <Txt w="600" size={13} color={colors.primary}>{f.valor(preset)}</Txt>
              </View>
              <View style={styles.filaPeso}>
                <Txt size={12} color={colors.text3}>Peso</Txt>
                <Slider
                  accessibilityLabel={`Peso de ${f.label.toLowerCase()}`}
                  style={{ flex: 1, height: 32 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={10}
                  value={pesos[f.id]}
                  onValueChange={(v) => v !== pesos[f.id] && cambiarPeso(f.id, v)}
                  minimumTrackTintColor={colors.ink}
                  maximumTrackTintColor={colors.borderMid}
                  thumbTintColor={colors.ink}
                />
                <Txt w="700" size={12} style={{ width: 44, textAlign: 'right' }}>{nivel(pesos[f.id])}</Txt>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BarraInferior>
        <Boton label="Generar horarios" size={16} onPress={() => router.navigate('/horarios')} />
      </BarraInferior>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg },
  contenido: { padding: 16, paddingTop: 12, gap: 16 },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  presetOn: { borderColor: colors.ink, backgroundColor: colors.ink },
  cabezaOscura: { gap: 2, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.ink },
  cabezaClara: {
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bloque: { gap: 8, padding: 12 },
  divisor: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  bloqueo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: 8,
  },
  toque: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  agregar: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.mute,
    backgroundColor: colors.surface,
  },
  agregarChip: { paddingHorizontal: 14, borderRadius: 22 },
  vetados: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vetado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderMid,
    backgroundColor: colors.chip,
  },
  pref: { gap: 4, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 },
  filaPref: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  filaPeso: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
