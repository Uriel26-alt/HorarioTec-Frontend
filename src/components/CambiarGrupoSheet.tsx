import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/theme';
import { MateriaId, rangoDias } from '@/data/mock';
import { alternativasSinCruce, ClaseResuelta, useStore } from '@/store';
import { Icon } from './Icon';
import { Boton, RiesgoBadge, Txt } from './ui';

type Props = {
  n: number;
  /** Materia del bloque tocado; null mantiene la hoja cerrada */
  materia: MateriaId | null;
  clases: ClaseResuelta[];
  onCerrar: () => void;
};

export function CambiarGrupoSheet({ n, materia, clases, onCerrar }: Props) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const clase = clases.find((c) => c.materia.id === materia);
  const alternativas = materia ? alternativasSinCruce(materia, clases) : [];

  return (
    <Modal visible={!!clase} transparent animationType="fade" statusBarTranslucent onRequestClose={onCerrar}>
      <View style={styles.fondo}>
        <Pressable accessibilityLabel="Cerrar hoja" onPress={onCerrar} style={StyleSheet.absoluteFill} />
        {clase && (
          <View accessibilityViewIsModal style={[styles.hoja, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.asa} />

            <View style={styles.cabeza}>
              <View style={[styles.tira, { backgroundColor: clase.materia.color.bar }]} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt accessibilityRole="header" w="display" size={18}>{clase.materia.nombre}</Txt>
                <Txt size={12} color={colors.text3}>
                  {clase.materia.clave} · {clase.materia.creditos} créditos · {clase.materia.grupos}{' '}
                  {clase.materia.grupos === 1 ? 'grupo ofertado' : 'grupos ofertados'}
                </Txt>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onCerrar} style={styles.cerrar}>
                <Icon name="cerrar" size={20} color={colors.text3} strokeWidth={2.5} />
              </Pressable>
            </View>

            <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 12 }}>
              <View style={[styles.actual, { backgroundColor: clase.materia.color.bg }]}>
                <View style={styles.filaActual}>
                  <Txt w="700" size={12} color={clase.materia.color.fg} style={styles.mayus}>Grupo actual</Txt>
                  <RiesgoBadge nivel={clase.grupo.riesgo} />
                </View>
                <Txt w="600" color={clase.materia.color.fg}>
                  <Txt w="mono" color={clase.materia.color.fg}>{clase.grupo.clave}</Txt> · {clase.grupo.profLargo}
                </Txt>
                <Txt size={13} color={clase.materia.color.fg}>
                  {rangoDias(clase.dias)} · {clase.hora}:00–{clase.hora + 1}:00 · {clase.grupo.aulaLarga}
                </Txt>
              </View>

              <Txt accessibilityRole="header" w="700" size={12} color={colors.text2} style={styles.mayus}>Alternativas sin cruce</Txt>

              {alternativas.length === 0 && (
                <Txt size={13} color={colors.text3}>No hay otro grupo de esta materia que quepa sin cruces en este horario.</Txt>
              )}

              {alternativas.map((alt) => (
                <View key={alt.clave} style={styles.alternativa}>
                  <View style={{ flex: 1, gap: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Txt w="mono" size={15}>{alt.clave}</Txt>
                      <RiesgoBadge nivel={alt.riesgo} />
                    </View>
                    <Txt size={13}>{alt.profLargo} · {alt.aulaLarga}</Txt>
                    <Txt size={13}>{rangoDias(alt.dias)} · {alt.hora}:00–{alt.hora + 1}:00</Txt>
                    <Txt w="600" size={12} color={alt.mejora ? colors.ok : colors.danger}>{alt.efecto}</Txt>
                  </View>
                  <Boton
                    label="Cambiar"
                    alto={48}
                    variante={alt.mejora ? 'primario' : 'contorno'}
                    onPress={() => {
                      store.cambiarGrupo(n, clase.materia.id, alt);
                      onCerrar();
                    }}
                  />
                </View>
              ))}

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  store.fijar({ materia: clase.materia.id, clave: clase.grupo.clave });
                  onCerrar();
                  router.back();
                }}
                style={styles.fijar}
              >
                <Icon name="pin" size={18} color={colors.primary} />
                <Txt w="700" color={colors.primary}>Fijar {clase.grupo.clave} y regenerar</Txt>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(16, 24, 40, 0.55)' },
  hoja: {
    maxHeight: '90%',
    gap: 12,
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  asa: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderMid },
  cabeza: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tira: { width: 6, height: 44, borderRadius: 3 },
  cerrar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  actual: { gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  filaActual: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  mayus: { textTransform: 'uppercase', letterSpacing: 0.5 },
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: 10,
  },
  fijar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
});
