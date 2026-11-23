import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '@/theme';
import { CARRERA, CREDITOS_MAX, CREDITOS_MIN, MATERIAS, PERIODO, SEMESTRE, SIN_OFERTA } from '@/data/mock';
import { useStore } from '@/store';
import { Icon } from '@/components/Icon';
import { Badge, BarraInferior, Boton, Encabezado, tarjeta, Titulo, Txt } from '@/components/ui';

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function MateriasScreen() {
  const { seleccion, creditos, toggleMateria } = useStore();
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    const q = sinAcentos(busqueda.trim());
    return q ? MATERIAS.filter((m) => sinAcentos(`${m.nombre} ${m.clave}`).includes(q)) : MATERIAS;
  }, [busqueda]);

  const elegidas = MATERIAS.filter((m) => seleccion.includes(m.id));
  const estado =
    creditos < CREDITOS_MIN
      ? { texto: `Faltan ${CREDITOS_MIN - creditos} créditos`, color: colors.warn }
      : creditos > CREDITOS_MAX
        ? { texto: `Sobran ${creditos - CREDITOS_MAX} créditos`, color: colors.danger }
        : { texto: 'Dentro del rango', color: colors.ok };
  const enRango = creditos >= CREDITOS_MIN && creditos <= CREDITOS_MAX;

  return (
    <View style={styles.pantalla}>
      <Encabezado>
        <View style={styles.filaTitulo}>
          <Titulo>Materias</Titulo>
          <Txt w="600" size={12} color={colors.text3}>{PERIODO}</Txt>
        </View>
        <Txt size={12} color={colors.text3}>{CARRERA}</Txt>
      </Encabezado>

      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 4 }}>
          <Txt w="600" size={12} color={colors.text2}>Buscar en la retícula</Txt>
          <TextInput
            accessibilityLabel="Buscar en la retícula"
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Nombre o clave de materia"
            placeholderTextColor={colors.mute}
            returnKeyType="search"
            autoCorrect={false}
            style={styles.buscar}
          />
        </View>

        <View accessibilityLabel="Créditos" style={[tarjeta, styles.creditos]}>
          <View style={styles.filaTitulo}>
            <Txt w="display" size={18}>{creditos} créditos</Txt>
            <Txt w="600" size={12} color={estado.color}>{estado.texto}</Txt>
          </View>
          <View style={styles.barra}>
            <View style={[styles.barraLlena, { width: `${Math.min(100, (creditos / CREDITOS_MAX) * 100)}%` }]} />
            <View style={[styles.marcaMinimo, { left: `${(CREDITOS_MIN / CREDITOS_MAX) * 100}%` }]} />
          </View>
          <View style={styles.filaTitulo}>
            <Txt size={12} color={colors.text3}>Mínimo {CREDITOS_MIN}</Txt>
            <Txt size={12} color={colors.text3}>
              {elegidas.length} {elegidas.length === 1 ? 'materia' : 'materias'}
            </Txt>
            <Txt size={12} color={colors.text3}>Máximo {CREDITOS_MAX}</Txt>
          </View>
        </View>

        {elegidas.length > 0 && (
          <View accessibilityLabel="Materias seleccionadas" style={styles.chips}>
            {elegidas.map((m) => (
              <View key={m.id} style={[styles.chip, { backgroundColor: m.color.bg }]}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: m.color.bar }} />
                <Txt w="600" size={12} color={m.color.fg}>{m.corto}</Txt>
              </View>
            ))}
          </View>
        )}

        <View style={[tarjeta, { overflow: 'hidden' }]}>
          <View style={styles.seccion}>
            <Txt accessibilityRole="header" w="700" size={12} color={colors.text2} style={styles.mayus}>{SEMESTRE}</Txt>
          </View>

          {visibles.map((m) => {
            const on = seleccion.includes(m.id);
            return (
              <Pressable
                key={m.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${on ? 'Quitar' : 'Agregar'} ${m.nombre}`}
                onPress={() => toggleMateria(m.id)}
                style={styles.fila}
              >
                <View style={[styles.tira, { backgroundColor: on ? m.color.bar : colors.borderMid }]} />
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt w="600" numberOfLines={1}>{m.nombre}</Txt>
                  <Txt size={12} color={colors.text3}>
                    {m.clave} · {m.creditos} créditos · {m.grupos} {m.grupos === 1 ? 'grupo' : 'grupos'}
                  </Txt>
                </View>
                <View style={styles.zonaCheck}>
                  {on ? (
                    <View style={[styles.check, { backgroundColor: colors.ink }]}>
                      <Icon name="check" size={16} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View style={[styles.check, styles.checkVacio]} />
                  )}
                </View>
              </Pressable>
            );
          })}

          {visibles.length === 0 && (
            <View style={{ padding: 12 }}>
              <Txt color={colors.text3}>Ninguna materia coincide con «{busqueda.trim()}».</Txt>
            </View>
          )}

          {!busqueda.trim() &&
            SIN_OFERTA.map((m) => (
              <View key={m.clave} style={styles.filaSinOferta}>
                <View style={[styles.tira, { backgroundColor: colors.borderStrong }]} />
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt w="600" color={colors.text2}>{m.nombre}</Txt>
                  <Txt size={12} color={colors.text3}>{m.clave} · {m.creditos} créditos</Txt>
                </View>
                <Badge label="Sin oferta este periodo" bg={colors.border} fg={colors.text2} style={styles.badgeSinOferta} />
              </View>
            ))}
        </View>
      </ScrollView>

      <BarraInferior>
        <Boton
          label="Continuar a preferencias"
          size={16}
          disabled={!enRango}
          onPress={() => router.push('/materias/preferencias')}
        />
      </BarraInferior>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg },
  contenido: { padding: 16, paddingTop: 12, gap: 12 },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  buscar: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
  },
  creditos: { padding: 12, gap: 6 },
  barra: { height: 8, borderRadius: 4, backgroundColor: colors.border },
  barraLlena: { position: 'absolute', left: 0, top: 0, height: 8, borderRadius: 4, backgroundColor: colors.ink },
  marcaMinimo: { position: 'absolute', top: -3, width: 2, height: 14, backgroundColor: colors.text3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: 14 },
  seccion: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mayus: { textTransform: 'uppercase', letterSpacing: 0.5 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tira: { width: 6, height: 36, borderRadius: 3 },
  zonaCheck: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  check: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkVacio: { borderWidth: 2, borderColor: colors.mute, backgroundColor: colors.surface },
  filaSinOferta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.chip,
  },
  badgeSinOferta: { paddingVertical: 4, alignSelf: 'center' },
});
