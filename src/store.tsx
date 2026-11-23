import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  ALTERNATIVAS,
  Alternativa,
  BLOQUEOS_INICIALES,
  Bloqueo,
  FIJADO_INICIAL,
  MATERIAS,
  MateriaId,
  OPCIONES,
  PRESETS,
  Pesos,
  PesoId,
  PresetId,
  SELECCION_INICIAL,
  SIN_COMBINACIONES,
  VETADOS_INICIALES,
} from '@/data/mock';

export type PlanId = 'A' | 'B' | 'C';
export const PLANES: PlanId[] = ['A', 'B', 'C'];

type Cambios = Record<number, Partial<Record<MateriaId, Alternativa>>>;

type Estado = {
  seleccion: MateriaId[];
  creditos: number;
  toggleMateria: (id: MateriaId) => void;

  preset: PresetId | null;
  pesos: Pesos;
  elegirPreset: (id: PresetId) => void;
  cambiarPeso: (id: PesoId, valor: number) => void;
  bloqueos: Bloqueo[];
  quitarBloqueo: (id: string) => void;
  vetados: string[];
  quitarVeto: (nombre: string) => void;

  planes: Record<PlanId, number | null>;
  planDe: (n: number) => PlanId | null;
  guardarPlan: (plan: PlanId, n: number) => void;
  comparar: number[];
  toggleComparar: (n: number) => void;
  fijado: { materia: MateriaId; clave: string } | null;
  fijar: (f: { materia: MateriaId; clave: string } | null) => void;

  /** Grupo elegido a mano por opción y materia desde «Cambiar grupo» */
  cambios: Cambios;
  cambiarGrupo: (n: number, materia: MateriaId, alt: Alternativa) => void;

  /** Demo del estado «sin combinaciones» mientras no hay generador real */
  sinCombinaciones: boolean;
  setSinCombinaciones: (v: boolean) => void;
  relajarBloqueo: () => void;
};

const Ctx = createContext<Estado | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [seleccion, setSeleccion] = useState<MateriaId[]>(SELECCION_INICIAL);
  const [preset, setPreset] = useState<PresetId | null>('compacto');
  const [pesos, setPesos] = useState<Pesos>({ ...PRESETS[0].pesos });
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>(BLOQUEOS_INICIALES);
  const [vetados, setVetados] = useState<string[]>(VETADOS_INICIALES);
  const [planes, setPlanes] = useState<Record<PlanId, number | null>>({ A: 1, B: 2, C: null });
  const [comparar, setComparar] = useState<number[]>([1, 2]);
  const [fijado, fijar] = useState(FIJADO_INICIAL);
  const [cambios, setCambios] = useState<Cambios>({});
  const [sinCombinaciones, setSinCombinaciones] = useState(false);

  const toggleMateria = useCallback((id: MateriaId) => {
    // Se conserva el orden de la retícula para que chips y listas no brinquen.
    setSeleccion((s) => MATERIAS.map((m) => m.id).filter((x) => (x === id ? !s.includes(x) : s.includes(x))));
  }, []);

  const elegirPreset = useCallback((id: PresetId) => {
    setPreset(id);
    setPesos({ ...PRESETS.find((p) => p.id === id)!.pesos });
  }, []);

  const cambiarPeso = useCallback((id: PesoId, valor: number) => {
    setPesos((p) => ({ ...p, [id]: valor }));
    setPreset(null);
  }, []);

  const guardarPlan = useCallback((plan: PlanId, n: number) => {
    setPlanes((prev) => {
      const yaEra = prev[plan] === n;
      const next = { ...prev };
      // Una opción solo puede ocupar un plan a la vez.
      PLANES.forEach((k) => {
        if (next[k] === n) next[k] = null;
      });
      next[plan] = yaEra ? null : n;
      return next;
    });
  }, []);

  const value = useMemo<Estado>(() => {
    const creditos = MATERIAS.filter((m) => seleccion.includes(m.id)).reduce((s, m) => s + m.creditos, 0);
    return {
      seleccion,
      creditos,
      toggleMateria,
      preset,
      pesos,
      elegirPreset,
      cambiarPeso,
      bloqueos,
      quitarBloqueo: (id) => setBloqueos((b) => b.filter((x) => x.id !== id)),
      vetados,
      quitarVeto: (nombre) => setVetados((v) => v.filter((x) => x !== nombre)),
      planes,
      planDe: (n) => PLANES.find((k) => planes[k] === n) ?? null,
      guardarPlan,
      comparar,
      toggleComparar: (n) => setComparar((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n])),
      fijado,
      fijar,
      cambios,
      cambiarGrupo: (n, materia, alt) => setCambios((c) => ({ ...c, [n]: { ...c[n], [materia]: alt } })),
      sinCombinaciones,
      setSinCombinaciones,
      relajarBloqueo: () => {
        setBloqueos((b) => b.map((x) => (x.id === 'trabajo' ? { ...x, rango: SIN_COMBINACIONES.bloqueoRelajado } : x)));
        setSinCombinaciones(false);
      },
    };
  }, [seleccion, preset, pesos, bloqueos, vetados, planes, comparar, fijado, cambios, sinCombinaciones, toggleMateria, elegirPreset, cambiarPeso, guardarPlan]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return v;
}

/* ---------- Derivados de un horario ---------- */

export type ClaseResuelta = {
  materia: (typeof MATERIAS)[number];
  dias: number[];
  hora: number;
  grupo: { clave: string; prof: string; profLargo: string; aula: string; aulaLarga: string; riesgo: 'alto' | 'medio' | 'bajo' };
};

/** Clases de una opción, ya filtradas por las materias elegidas y con los cambios de grupo aplicados. */
export function resolverClases(n: number, seleccion: MateriaId[], cambios: Cambios): ClaseResuelta[] {
  const opcion = OPCIONES.find((o) => o.n === n);
  if (!opcion) return [];
  return opcion.clases
    .filter((c) => seleccion.includes(c.materia))
    .map((c) => {
      const materia = MATERIAS.find((m) => m.id === c.materia)!;
      const alt = cambios[n]?.[c.materia];
      return alt
        ? { materia, dias: alt.dias, hora: alt.hora, grupo: alt }
        : { materia, dias: c.dias, hora: c.hora, grupo: materia.grupo };
    });
}

export type Hueco = { dia: number; hora: number; horas: number };

/** Horas libres entre la primera y la última clase de cada día. */
export function calcularHuecos(clases: ClaseResuelta[]): Hueco[] {
  const huecos: Hueco[] = [];
  for (let dia = 1; dia <= 5; dia++) {
    const horas = clases.filter((c) => c.dias.includes(dia)).map((c) => c.hora).sort((a, b) => a - b);
    for (let i = 1; i < horas.length; i++) {
      const libre = horas[i] - horas[i - 1] - 1;
      if (libre > 0) huecos.push({ dia, hora: horas[i - 1] + 1, horas: libre });
    }
  }
  return huecos;
}

/** Alternativas de una materia que no chocan con el resto del horario. */
export function alternativasSinCruce(materia: MateriaId, clases: ClaseResuelta[]): Alternativa[] {
  const actual = clases.find((c) => c.materia.id === materia);
  return (ALTERNATIVAS[materia] ?? []).filter(
    (alt) =>
      alt.clave !== actual?.grupo.clave &&
      !clases.some((c) => c.materia.id !== materia && c.hora === alt.hora && c.dias.some((d) => alt.dias.includes(d))),
  );
}

/** Entrada, salida y horas muertas calculadas a partir de las clases. */
export function resumenHorario(clases: ClaseResuelta[]) {
  if (clases.length === 0) return { entrada: 7, salida: 14, muertas: 0 };
  const horas = clases.map((c) => c.hora);
  return {
    entrada: Math.min(...horas),
    salida: Math.max(...horas) + 1,
    muertas: calcularHuecos(clases).reduce((s, h) => s + h.horas, 0),
  };
}
