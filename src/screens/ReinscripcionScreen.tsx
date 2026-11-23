import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cerrado, colors, riesgo as RIESGO, Riesgo } from '@/theme';
import { MateriaId, ORDEN_CAPTURA, rangoDias, TURNO, YA_INSCRITAS } from '@/data/mock';
import { alternativasSinCruce, ClaseResuelta, resolverClases, useStore } from '@/store';
import { Icon } from '@/components/Icon';
import { Badge, Txt } from '@/components/ui';

type Captura = {
  id: MateriaId;
  nombre: string;
  clave: string;
  meta: string;
  riesgo: Riesgo;
  barra: string;
  estado: 'inscrito' | 'pendiente' | 'cerrado';
  alt?: { clave: string; meta: string; riesgo: Riesgo; nota: string };
};

const meta = (prof: string, dias: number[], hora: number, aula: string) => `${prof} · ${rangoDias(dias)} ${hora}:00 · ${aula}`;

function capturasIniciales(clases: ClaseResuelta[]): Captura[] {
  return ORDEN_CAPTURA.flatMap((id) => {
    const c = clases.find((x) => x.materia.id === id);
    if (!c) return [];
    // La alternativa es el primer grupo de respaldo que no choca con el resto del plan.
    const a = alternativasSinCruce(id, clases)[0];
    return [{
      id,
      nombre: c.materia.nombre,
      clave: c.grupo.clave,
      meta: meta(c.grupo.profLargo, c.dias, c.hora, c.grupo.aulaLarga),
      riesgo: c.grupo.riesgo,
      barra: c.materia.color.barOscuro,
      estado: YA_INSCRITAS.includes(id) ? 'inscrito' : 'pendiente',
      alt: a && { clave: a.clave, meta: meta(a.profLargo, a.dias, a.hora, a.aulaLarga), riesgo: a.riesgo, nota: a.nota },
    } satisfies Captura];
  });
}

export default function ReinscripcionScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ n?: string }>();
  const n = Number(params.n) || 1;
  const store = useStore();
  const plan = store.planDe(n);

  // El plan se congela al entrar: durante el turno no debe cambiar por ediciones en otras pantallas.
  const inicial = useMemo(() => capturasIniciales(resolverClases(n, store.seleccion, store.cambios)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [items, setItems] = useState(inicial);
  const [copiada, setCopiada] = useState<string | null>(null);
  const [segundos, setSegundos] = useState(TURNO.segundosRestantes);

  useEffect(() => {
    const t = setInterval(() => setSegundos((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const cambiar = (id: MateriaId, fn: (c: Captura) => Captura) => setItems((xs) => xs.map((c) => (c.id === id ? fn(c) : c)));
  const copiar = (clave: string) => {
    Clipboard.setStringAsync(clave).catch(() => {});
    setCopiada(clave);
  };

  const hechas = items.filter((i) => i.estado === 'inscrito');
  const resto = items.filter((i) => i.estado !== 'inscrito');
  const actual = resto[0];
  const progreso = `${hechas.length} de ${items.length} inscritas`;
  const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
  const ss = String(segundos % 60).padStart(2, '0');

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* TODO: conectar al estado real de red (p. ej. expo-network); por ahora replica el mockup. */}
      <View accessibilityRole="alert" style={styles.sinConexion}>
        <Icon name="sinConexion" size={16} color="#5C3900" strokeWidth={2.5} />
        <Txt w="700" size={12} color="#5C3900">Sin conexión · tus claves y planes están guardados</Txt>
      </View>

      <View style={styles.cabeza}>
        <Txt w="600" size={13} color={colors.nightText}>Modo reinscripción · {plan ? `Plan ${plan}` : `Opción ${n}`}</Txt>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.salir}>
          <Txt w="700" size={13} color={colors.nightLink}>Salir</Txt>
        </Pressable>
      </View>

      <View style={styles.turno}>
        <View>
          <Txt size={12} color={colors.nightText}>Tu turno abrió {TURNO.abrio} · se cierra en</Txt>
          <Txt accessibilityRole="timer" w="mono" size={44} lh={1.05} color="#FFFFFF" style={{ letterSpacing: -0.9 }}>{mm}:{ss}</Txt>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6, paddingBottom: 6 }}>
          <Txt w="700" color="#FFFFFF">{progreso}</Txt>
          <View accessible accessibilityRole="progressbar" accessibilityLabel={progreso} style={styles.progreso}>
            <View style={[styles.progresoLleno, { width: `${items.length ? (hechas.length / items.length) * 100 : 0}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.lista, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {hechas.map((d) => (
          <View key={d.id} style={styles.hecha}>
            <Icon name="check" size={18} color={colors.green} strokeWidth={3} />
            <Txt color={colors.nightText} numberOfLines={1} style={{ flex: 1 }}>{d.nombre}</Txt>
            <Txt w="mono" color={colors.nightText}>{d.clave}</Txt>
            <Txt w="700" size={12} color={colors.green}>Inscrito</Txt>
          </View>
        ))}

        {actual && (
          <View accessibilityLabel="Grupo en captura" style={styles.actual}>
            <View style={styles.fila}>
              <Txt w="700" size={12} color={colors.nightLink} style={styles.mayus}>
                Captura {hechas.length + 1} de {items.length}
              </Txt>
              <View style={{ flex: 1 }} />
              <Badge label={RIESGO[actual.riesgo].largo} bg={RIESGO[actual.riesgo].bg} fg={RIESGO[actual.riesgo].fg} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ width: 6, borderRadius: 3, backgroundColor: actual.barra }} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt w="display" size={20} lh={1.2} color="#FFFFFF">{actual.nombre}</Txt>
                <Txt size={13} color={colors.nightText}>{actual.meta}</Txt>
              </View>
            </View>

            {actual.estado === 'pendiente' ? (
              <View style={{ gap: 10 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Copiar clave ${actual.clave}`}
                  onPress={() => copiar(actual.clave)}
                  style={({ pressed }) => [styles.copiar, pressed && { opacity: 0.9 }]}
                >
                  <Txt w="mono" size={30} lh={1.2} color={colors.night} style={{ letterSpacing: 0.6 }}>{actual.clave}</Txt>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="copiar" size={20} color={colors.night} strokeWidth={2.25} />
                    <Txt w="700" size={16} color={colors.night}>{copiada === actual.clave ? 'Clave copiada' : 'Copiar clave'}</Txt>
                  </View>
                </Pressable>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => cambiar(actual.id, (c) => ({ ...c, estado: 'cerrado' }))}
                    style={[styles.accion, styles.seCerro]}
                  >
                    <Txt w="700" size={17} color="#FECACA">Se cerró</Txt>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => cambiar(actual.id, (c) => ({ ...c, estado: 'inscrito' }))}
                    style={[styles.accion, { backgroundColor: colors.green }]}
                  >
                    <Txt w="700" size={17} color={colors.greenInk}>Inscrito</Txt>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                <View style={styles.fila}>
                  <Txt w="mono" size={18} color={colors.nightText} style={{ textDecorationLine: 'line-through' }}>{actual.clave}</Txt>
                  <Badge label="Cerrado" bg={cerrado.bg} fg={cerrado.fg} />
                  <View style={{ flex: 1 }} />
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => cambiar(actual.id, (c) => ({ ...c, estado: 'pendiente' }))}
                    style={styles.deshacer}
                  >
                    <Txt w="700" color={colors.nightLink}>Deshacer</Txt>
                  </Pressable>
                </View>

                {actual.alt ? (
                  <>
                    <View style={styles.alternativa}>
                      <View style={styles.fila}>
                        <Txt w="700" size={12} color={colors.text2} style={styles.mayus}>Alternativa propuesta</Txt>
                        <View style={{ flex: 1 }} />
                        <Badge label={RIESGO[actual.alt.riesgo].largo} bg={RIESGO[actual.alt.riesgo].bg} fg={RIESGO[actual.alt.riesgo].fg} />
                      </View>
                      <Txt w="mono" size={30} lh={1.1}>{actual.alt.clave}</Txt>
                      <Txt w="600" size={13}>{actual.alt.meta}</Txt>
                      <Txt w="600" size={13} color={colors.ok}>{actual.alt.nota}</Txt>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        cambiar(actual.id, (c) =>
                          c.alt ? { ...c, clave: c.alt.clave, meta: c.alt.meta, riesgo: c.alt.riesgo, estado: 'pendiente', alt: undefined } : c,
                        )
                      }
                      style={[styles.accion, { height: 64, flex: 0, backgroundColor: colors.green }]}
                    >
                      <Txt w="700" size={17} color={colors.greenInk}>Aceptar alternativa</Txt>
                    </Pressable>
                    <Txt size={12} color={colors.nightText} style={{ textAlign: 'center' }}>
                      Recalculado sin conexión · conserva tus {hechas.length} inscritas
                    </Txt>
                  </>
                ) : (
                  <Txt size={13} color={colors.nightText}>
                    No queda otro grupo de esta materia sin cruces. Sigue con las demás y revísala al final.
                  </Txt>
                )}
              </View>
            )}
          </View>
        )}

        {resto.slice(1).map((p) => (
          <View key={p.id} style={styles.pendiente}>
            <View style={{ width: 6, height: 32, borderRadius: 3, backgroundColor: p.barra }} />
            <View style={{ flex: 1 }}>
              <Txt w="600" color="#FFFFFF" numberOfLines={1}>{p.nombre}</Txt>
              <Txt size={12} color={colors.nightText}>
                <Txt w="mono" size={12} color="#FFFFFF">{p.clave}</Txt> · {RIESGO[p.riesgo].largo}
              </Txt>
            </View>
            <Txt w="600" size={12} color={colors.nightText}>Sigue</Txt>
            <Pressable accessibilityRole="button" accessibilityLabel={`Copiar clave ${p.clave}`} onPress={() => copiar(p.clave)} style={styles.copiarChico}>
              <Icon name={copiada === p.clave ? 'check' : 'copiar'} size={18} color="#FFFFFF" strokeWidth={2.25} />
            </Pressable>
          </View>
        ))}

        {!actual && (
          <View style={styles.listo}>
            <Txt w="display" size={22} color="#FFFFFF">Listo: {hechas.length} de {items.length} inscritas</Txt>
            <Txt color={colors.nightText}>Revisa tu carga en el portal oficial antes de cerrar sesión.</Txt>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.verFinal}>
              <Txt w="700" size={16} color={colors.night}>Ver mi horario final</Txt>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.night },
  sinConexion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 32,
    paddingHorizontal: 12,
    backgroundColor: '#FDECC8',
  },
  cabeza: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 4, paddingHorizontal: 16 },
  salir: { minHeight: 44, justifyContent: 'center' },
  turno: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, paddingBottom: 12 },
  progreso: { width: 120, height: 8, borderRadius: 4, backgroundColor: colors.text2 },
  progresoLleno: { height: 8, borderRadius: 4, backgroundColor: colors.green },
  lista: { gap: 8, paddingHorizontal: 12 },
  hecha: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.nightRow },
  actual: { gap: 10, padding: 14, borderRadius: 14, backgroundColor: colors.nightCard, borderWidth: 1.5, borderColor: colors.nightBorder },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mayus: { textTransform: 'uppercase', letterSpacing: 0.6 },
  copiar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    height: 72,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  accion: { flex: 1, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  seCerro: { borderWidth: 2, borderColor: '#FCA5A5' },
  deshacer: { height: 44, paddingHorizontal: 8, justifyContent: 'center' },
  alternativa: { gap: 6, padding: 12, borderRadius: 12, backgroundColor: '#FFFFFF' },
  pendiente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 10,
    backgroundColor: colors.nightRow,
  },
  copiarChico: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.mute },
  listo: { gap: 10, padding: 16, borderRadius: 14, backgroundColor: colors.nightCard },
  verFinal: { height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#FFFFFF' },
});
