import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { cerrado, colors, riesgo as RIESGO } from '@/theme';
import { HORA_FIN, HORA_INICIO, MateriaId, OPCIONES } from '@/data/mock';
import { calcularHuecos, ClaseResuelta, resolverClases, resumenHorario, useStore } from '@/store';
import { CambiarGrupoSheet } from '@/components/CambiarGrupoSheet';
import { Badge, BarraInferior, Boton, Encabezado, pendiente, PlanBadge, RiesgoBadge, tarjeta, Titulo, Txt } from '@/components/ui';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const DIAS_LARGOS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
const COL_HORAS = 34;
const GAP = 3;
const FILA = 78;

export default function DetalleScreen() {
  const params = useLocalSearchParams<{ n?: string }>();
  const n = Number(params.n) || 1;
  const store = useStore();
  const opcion = OPCIONES.find((o) => o.n === n) ?? OPCIONES[0];
  const clases = resolverClases(opcion.n, store.seleccion, store.cambios);
  const { entrada, salida, muertas } = resumenHorario(clases);
  const plan = store.planDe(opcion.n);
  const [abierta, setAbierta] = useState<MateriaId | null>(null);

  return (
    <View style={styles.pantalla}>
      <Encabezado atras="Horarios">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Titulo>Opción {opcion.n}</Titulo>
          {plan && <PlanBadge plan={plan} />}
        </View>
        <Txt size={12} color={colors.text3}>
          {opcion.puntaje} puntos · {entrada}:00 a {salida}:00 · {muertas} h muertas · {store.creditos} créditos
        </Txt>
      </Encabezado>

      <ScrollView contentContainerStyle={styles.contenido}>
        <Txt size={12} color={colors.text3} style={{ paddingHorizontal: 8 }}>
          Toca un bloque para ver grupos alternativos sin cruce.
        </Txt>

        <Semana clases={clases} onBloque={setAbierta} />

        <View accessibilityLabel="Leyenda de riesgo" style={styles.leyenda}>
          <Txt size={12} color={colors.text3}>Riesgo de cierre:</Txt>
          <RiesgoBadge nivel="bajo" corto />
          <RiesgoBadge nivel="medio" corto />
          <RiesgoBadge nivel="alto" corto />
          <Badge label="Cerrado" bg={cerrado.bg} fg={cerrado.fg} />
        </View>
      </ScrollView>

      <BarraInferior style={{ flexDirection: 'row', gap: 8 }}>
        <Boton label="Exportar" variante="contorno" onPress={() => pendiente('Exportar horario')} />
        <Boton
          label="Modo reinscripción"
          size={16}
          style={{ flex: 1 }}
          onPress={() => router.push({ pathname: '/reinscripcion', params: { n: String(opcion.n) } })}
        />
      </BarraInferior>

      <CambiarGrupoSheet n={opcion.n} materia={abierta} clases={clases} onCerrar={() => setAbierta(null)} />
    </View>
  );
}

function Semana({ clases, onBloque }: { clases: ClaseResuelta[]; onBloque: (id: MateriaId) => void }) {
  const { entrada, salida } = resumenHorario(clases);
  const desde = Math.min(HORA_INICIO, entrada);
  const hasta = Math.max(HORA_FIN, salida);
  const horas = Array.from({ length: hasta - desde }, (_, i) => desde + i);
  const y = (hora: number) => (hora - desde) * (FILA + GAP);
  const alto = horas.length * FILA + (horas.length - 1) * GAP;
  const huecos = calcularHuecos(clases);

  return (
    <View style={[tarjeta, styles.semana]}>
      <View style={styles.filaSemana}>
        <View style={{ width: COL_HORAS }} />
        {DIAS.map((d) => (
          <Txt key={d} w="700" size={11} color={colors.text2} style={{ flex: 1, textAlign: 'center' }}>{d}</Txt>
        ))}
      </View>

      <View style={[styles.filaSemana, { height: alto }]}>
        <View style={{ width: COL_HORAS }}>
          {horas.map((h) => (
            <Txt key={h} w="600" size={11} color={colors.text3} style={[styles.hora, { top: y(h) }]}>{h}:00</Txt>
          ))}
        </View>

        {DIAS.map((_, i) => {
          const dia = i + 1;
          return (
            <View key={dia} style={{ flex: 1 }}>
              {clases
                .filter((c) => c.dias.includes(dia))
                .map((c) => {
                  const r = RIESGO[c.grupo.riesgo];
                  const fg = c.materia.color.fg;
                  return (
                    <Pressable
                      key={c.materia.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${c.materia.nombre}, grupo ${c.grupo.clave}, ${DIAS_LARGOS[i]} ${c.hora}:00, riesgo ${r.corto.toLowerCase()}. Ver alternativas`}
                      onPress={() => onBloque(c.materia.id)}
                      style={[styles.bloque, { top: y(c.hora), backgroundColor: c.materia.color.bg, borderTopColor: c.materia.color.bar }]}
                    >
                      <Txt w="700" size={11} lh={1.25} color={fg} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{c.materia.cortoCal}</Txt>
                      <Txt size={10} lh={1.25} color={fg} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{c.grupo.prof}</Txt>
                      <Txt size={10} lh={1.25} color={fg} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                        {c.grupo.aula} · <Txt w="mono" size={10} lh={1.25} color={fg}>{c.grupo.clave}</Txt>
                      </Txt>
                      <View style={[styles.riesgoBloque, { backgroundColor: r.bg }]}>
                        <Txt w="700" size={10} lh={1.25} color={r.fg}>{r.corto}</Txt>
                      </View>
                    </Pressable>
                  );
                })}

              {huecos
                .filter((g) => g.dia === dia)
                .map((g) => (
                  <View
                    key={g.hora}
                    accessible
                    accessibilityLabel={`Hueco de ${g.horas} h el ${DIAS_LARGOS[i]} a las ${g.hora}:00`}
                    style={[styles.hueco, { top: y(g.hora), height: g.horas * FILA + (g.horas - 1) * GAP }]}
                  >
                    <Txt w="600" size={10} lh={1.25} color={colors.gapFg}>Hueco</Txt>
                    <Txt w="700" size={13} lh={1.25} color={colors.gapFg}>{g.horas} h</Txt>
                  </View>
                ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.bg },
  contenido: { paddingHorizontal: 8, paddingVertical: 10, gap: 10 },
  semana: { gap: 4, paddingTop: 6, paddingRight: 4, paddingBottom: 4 },
  filaSemana: { flexDirection: 'row', gap: GAP },
  hora: { position: 'absolute', left: 0, right: 0, textAlign: 'right', paddingRight: 2 },
  bloque: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: FILA,
    paddingHorizontal: 4,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 6,
    borderTopWidth: 3,
    overflow: 'hidden',
  },
  riesgoBloque: { alignSelf: 'flex-start', marginTop: 'auto', paddingHorizontal: 4, borderRadius: 3 },
  hueco: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.gapBorder,
    backgroundColor: colors.gapBg,
  },
  leyenda: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
});
