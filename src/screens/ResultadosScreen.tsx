import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, Riesgo } from '@/theme';
import { materiaPorId, OPCIONES, SIN_COMBINACIONES, TOTAL_COMBINACIONES } from '@/data/mock';
import { PLANES, resolverClases, resumenHorario, useStore } from '@/store';
import { Icon } from '@/components/Icon';
import { MiniCalendario } from '@/components/MiniCalendario';
import { BarraInferior, Boton, Encabezado, pendiente, PlanBadge, RiesgoBadge, tarjeta, Titulo, Txt } from '@/components/ui';

const ORDENES = [
  { id: 'puntaje', label: 'Puntaje', frase: 'puntaje' },
  { id: 'muertas', label: 'Horas muertas', frase: 'horas muertas' },
  { id: 'riesgo', label: 'Riesgo', frase: 'riesgo' },
] as const;
const PESO_RIESGO: Record<Riesgo, number> = { bajo: 0, medio: 1, alto: 2 };

export default function ResultadosScreen() {
  const store = useStore();
  const [orden, setOrden] = useState(0);
  const [sinRiesgoAlto, setSinRiesgoAlto] = useState(false);
  const [salida14, setSalida14] = useState(true);

  const vacio = store.sinCombinaciones || store.seleccion.length === 0;

  const opciones = OPCIONES.map((o) => {
    const clases = resolverClases(o.n, store.seleccion, store.cambios);
    return { ...o, clases, resumen: resumenHorario(clases) };
  })
    .filter((o) => (!sinRiesgoAlto || o.riesgo !== 'alto') && (!salida14 || o.resumen.salida <= 14))
    .sort((a, b) =>
      ORDENES[orden].id === 'muertas'
        ? a.resumen.muertas - b.resumen.muertas
        : ORDENES[orden].id === 'riesgo'
          ? PESO_RIESGO[a.riesgo] - PESO_RIESGO[b.riesgo]
          : b.puntaje - a.puntaje,
    );

  const nComparar = store.comparar.length;

  return (
    <View style={styles.pantalla}>
      <Encabezado>
        <View style={styles.filaTitulo}>
          <Titulo>Horarios</Titulo>
          <Pressable accessibilityRole="link" onPress={() => router.navigate('/materias/preferencias')} style={styles.enlace}>
            <Txt w="600" size={13} color={colors.primary}>Editar preferencias</Txt>
          </Pressable>
        </View>
        <Txt size={12} color={colors.text3}>
          {vacio
            ? '0 combinaciones sin cruces'
            : `${TOTAL_COMBINACIONES} combinaciones sin cruces · ordenadas por ${ORDENES[orden].frase}`}
        </Txt>
      </Encabezado>

      {vacio ? (
        <SinCombinaciones />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.contenido}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={styles.filtros}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Orden: ${ORDENES[orden].label}. Toca para cambiar`}
                onPress={() => setOrden((orden + 1) % ORDENES.length)}
                style={styles.filtro}
              >
                <Txt w="600" size={13}>Orden: {ORDENES[orden].label}</Txt>
                <Icon name="abajo" size={14} strokeWidth={2.5} />
              </Pressable>
              <Filtro label="Sin riesgo alto" on={sinRiesgoAlto} onPress={() => setSinRiesgoAlto(!sinRiesgoAlto)} />
              <Filtro label="Salida ≤ 14:00" on={salida14} onPress={() => setSalida14(!salida14)} />
            </ScrollView>

            {store.fijado && (
              <View style={styles.fijado}>
                <Icon name="pin" size={18} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Txt size={12} color={colors.text2}>Grupo fijado</Txt>
                  <Txt w="600">
                    {materiaPorId(store.fijado.materia).corto} · <Txt w="mono">{store.fijado.clave}</Txt>
                  </Txt>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Quitar grupo fijado" onPress={() => store.fijar(null)} style={styles.quitar}>
                  <Txt w="700" color={colors.primary}>Quitar</Txt>
                </Pressable>
              </View>
            )}

            {opciones.length === 0 && (
              <Txt color={colors.text3} style={{ paddingVertical: 12 }}>Ningún horario cumple con los filtros activos.</Txt>
            )}

            {opciones.map((o) => {
              const plan = store.planDe(o.n);
              const enComparacion = store.comparar.includes(o.n);
              return (
                <View key={o.n} style={[tarjeta, styles.opcion]}>
                  <View style={styles.filaOpcion}>
                    <Txt accessibilityRole="header" w="display" size={16}>Opción {o.n}</Txt>
                    {plan && <PlanBadge plan={plan} />}
                    <View style={{ flex: 1 }} />
                    <Pressable
                      accessibilityRole="link"
                      accessibilityLabel={`Ver detalle de la opción ${o.n}`}
                      onPress={() => router.push({ pathname: '/horarios/detalle', params: { n: String(o.n) } })}
                      style={styles.verDetalle}
                    >
                      <Txt w="600" size={13} color={colors.primary}>Ver detalle</Txt>
                      <Icon name="adelante" size={16} color={colors.primary} strokeWidth={2.5} />
                    </Pressable>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <MiniCalendario n={o.n} clases={o.clases} />
                    <View style={{ flex: 1, gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                        <Txt w="display" size={32} lh={1}>{o.puntaje}</Txt>
                        <Txt size={12} color={colors.text3}>/ 100 puntos</Txt>
                      </View>
                      <Txt w="600">Entrada {o.resumen.entrada}:00 · Salida {o.resumen.salida}:00</Txt>
                      <Dato etiqueta="Horas muertas" valor={`${o.resumen.muertas} h`} />
                      <Dato etiqueta="Preferencias" valor={o.prefs} />
                      <RiesgoBadge nivel={o.riesgo} punto />
                    </View>
                  </View>

                  <View style={styles.pieOpcion}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: enComparacion }}
                      onPress={() => store.toggleComparar(o.n)}
                      style={[styles.comparar, enComparacion && styles.compararOn]}
                    >
                      <Txt w="600" size={13}>{enComparacion ? 'En comparación' : 'Comparar'}</Txt>
                    </Pressable>
                    <Txt size={12} color={colors.text3} style={{ flex: 1, textAlign: 'right' }}>Guardar como</Txt>
                    {PLANES.map((k) => {
                      const on = plan === k;
                      return (
                        <Pressable
                          key={k}
                          accessibilityRole="button"
                          accessibilityState={{ selected: on }}
                          accessibilityLabel={`Guardar opción ${o.n} como plan ${k}`}
                          onPress={() => store.guardarPlan(k, o.n)}
                          style={[styles.plan, on && styles.planOn]}
                        >
                          <Txt w="700" color={on ? '#FFFFFF' : colors.ink}>{k}</Txt>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <BarraInferior style={styles.barraComparar}>
            <Txt w="600" style={{ flex: 1 }}>
              {nComparar === 1 ? '1 opción' : `${nComparar} opciones`} para comparar
            </Txt>
            <Boton label="Comparar" alto={48} disabled={nComparar < 2} onPress={() => pendiente('Comparar horarios')} style={{ paddingHorizontal: 20 }} />
          </BarraInferior>
        </>
      )}
    </View>
  );
}

function Filtro({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={onPress} style={[styles.filtro, on && styles.filtroOn]}>
      <Txt w="600" size={13} color={on ? '#FFFFFF' : colors.ink}>{label}</Txt>
    </Pressable>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Txt size={13} color={colors.text3}>{etiqueta}</Txt>
      <Txt w="600" size={13}>{valor}</Txt>
    </View>
  );
}

function SinCombinaciones() {
  const store = useStore();
  const sinMaterias = store.seleccion.length === 0;
  const materia = materiaPorId(SIN_COMBINACIONES.materia);
  const bloqueo = store.bloqueos.find((b) => b.id === 'trabajo');
  const restantes = store.seleccion.filter((id) => id !== materia.id);
  const creditosRestantes = store.creditos - (store.seleccion.includes(materia.id) ? materia.creditos : 0);

  return (
    <ScrollView contentContainerStyle={styles.vacio}>
      <View style={{ gap: 8 }}>
        <Icon name="sinHorarios" size={40} color={colors.text3} strokeWidth={1.75} />
        <Txt accessibilityRole="header" w="display" size={22}>No hay combinaciones</Txt>
        {sinMaterias ? (
          <Txt color={colors.text2}>Todavía no eliges materias para este periodo.</Txt>
        ) : (
          <Txt color={colors.text2}>
            {materia.nombre} solo tiene un grupo (<Txt w="mono" color={colors.text2}>{materia.grupo.clave}</Txt>, {SIN_COMBINACIONES.horario}) y choca con tu bloqueo de trabajo.
          </Txt>
        )}
      </View>

      {sinMaterias ? (
        <Boton label="Elegir materias" onPress={() => router.navigate('/materias')} />
      ) : (
        <>
          <View style={{ gap: 8 }}>
            <Txt accessibilityRole="header" w="700" size={12} color={colors.text2} style={styles.mayus}>Qué puedes relajar</Txt>
            <View style={[tarjeta, styles.sugerencia]}>
              <View style={{ gap: 2 }}>
                <Txt w="700">Acortar el bloqueo a 16:00–21:00</Txt>
                <Txt size={13} color={colors.text3}>Hoy: {bloqueo ? `${bloqueo.rango} · ${bloqueo.motivo}` : 'sin bloqueo'}</Txt>
              </View>
              <View style={styles.filaSugerencia}>
                <Txt w="600" size={13} color={colors.ok} style={{ flex: 1 }}>
                  Aparecen {SIN_COMBINACIONES.combinacionesAlRelajar} combinaciones
                </Txt>
                <Boton label="Aplicar y regenerar" alto={44} onPress={store.relajarBloqueo} style={{ borderRadius: 8 }} />
              </View>
            </View>
            <View style={[tarjeta, styles.sugerencia]}>
              <View style={{ gap: 2 }}>
                <Txt w="700">Dejar {materia.nombre} para otro periodo</Txt>
                <Txt size={13} color={colors.text3}>
                  Quedarías con {restantes.length} materias y {creditosRestantes} créditos (mínimo 20)
                </Txt>
              </View>
              <View style={styles.filaSugerencia}>
                <Txt w="600" size={13} color={colors.ok} style={{ flex: 1 }}>
                  Aparecen {SIN_COMBINACIONES.combinacionesAlQuitar} combinaciones
                </Txt>
                <Boton
                  label="Quitar materia"
                  variante="contorno"
                  alto={44}
                  style={{ borderRadius: 8 }}
                  onPress={() => {
                    if (store.seleccion.includes(materia.id)) store.toggleMateria(materia.id);
                    store.setSinCombinaciones(false);
                    router.navigate('/materias');
                  }}
                />
              </View>
            </View>
          </View>
          <Txt size={13} color={colors.text3}>
            Las preferencias con peso no descartan horarios; solo las reglas de «Obligatorio».
          </Txt>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg },
  contenido: { padding: 16, paddingTop: 12, gap: 12 },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  enlace: { minHeight: 44, justifyContent: 'center' },
  filtros: { flexGrow: 0, marginHorizontal: -16, paddingHorizontal: 16 },
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  filtroOn: { borderColor: colors.ink, backgroundColor: colors.ink },
  fijado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 4,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 10,
    backgroundColor: colors.primaryBg,
  },
  quitar: { height: 44, paddingHorizontal: 12, justifyContent: 'center' },
  opcion: { padding: 12, gap: 10 },
  filaOpcion: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verDetalle: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44 },
  pieOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  comparar: {
    height: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  compararOn: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  plan: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  planOn: { borderColor: colors.ink, backgroundColor: colors.ink },
  barraComparar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vacio: { padding: 16, paddingTop: 24, gap: 16 },
  mayus: { textTransform: 'uppercase', letterSpacing: 0.5 },
  sugerencia: { padding: 12, gap: 10 },
  filaSugerencia: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
