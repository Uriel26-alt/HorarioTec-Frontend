/**
 * Datos de ejemplo tomados de los mockups.
 * Este archivo es el único punto que hay que sustituir cuando exista el backend.
 */
import type { Riesgo } from '@/theme';

export type MateriaId = 'ARQ' | 'SIM' | 'TBD' | 'WEB' | 'FIS' | 'TEL' | 'DES';

export type Grupo = {
  clave: string;
  /** Nombre corto para el bloque del calendario */
  prof: string;
  /** Nombre completo con título */
  profLargo: string;
  aula: string;
  aulaLarga: string;
  riesgo: Riesgo;
};

export type Materia = {
  id: MateriaId;
  nombre: string;
  /** Chip de la pantalla de materias */
  corto: string;
  /** Bloque del calendario */
  cortoCal: string;
  clave: string;
  creditos: number;
  grupos: number;
  color: { bg: string; bar: string; fg: string; barOscuro: string };
  /** Grupo que usa el generador en las opciones de ejemplo */
  grupo: Grupo;
};

export const PERIODO = 'Ene–Jun 2027';
export const CARRERA = 'Ing. en Sistemas Computacionales · 5.º semestre · Plan ISIC-2010-224';
export const SEMESTRE = '5.º semestre';
export const CREDITOS_MIN = 20;
export const CREDITOS_MAX = 36;

export const MATERIAS: Materia[] = [
  {
    id: 'ARQ', nombre: 'Arquitectura de Computadoras', corto: 'Arquitectura', cortoCal: 'Arq. Comp.',
    clave: 'SCD-1003', creditos: 5, grupos: 3,
    color: { bg: '#DCE8FF', bar: '#2F5FD0', fg: '#173A8A', barOscuro: '#8FB0FF' },
    grupo: { clave: 'ISC-5B', prof: 'Hernández', profLargo: 'Mtro. Hernández Ruiz', aula: 'K3', aulaLarga: 'Aula K3', riesgo: 'alto' },
  },
  {
    id: 'SIM', nombre: 'Simulación', corto: 'Simulación', cortoCal: 'Simulación',
    clave: 'SCD-1022', creditos: 5, grupos: 4,
    color: { bg: '#FFE3CC', bar: '#C2540A', fg: '#7A3306', barOscuro: '#FFB27A' },
    grupo: { clave: 'ISC-5D', prof: 'Cruz M.', profLargo: 'Mtra. Cruz Matus', aula: 'I5', aulaLarga: 'Aula I5', riesgo: 'medio' },
  },
  {
    id: 'TBD', nombre: 'Taller de Bases de Datos', corto: 'Taller BD', cortoCal: 'Taller BD',
    clave: 'SCA-1025', creditos: 4, grupos: 3,
    color: { bg: '#E9DDFB', bar: '#6D3FC4', fg: '#45248A', barOscuro: '#C4A8F5' },
    grupo: { clave: 'ISC-5A', prof: 'López S.', profLargo: 'Ing. López Santiago', aula: 'LC2', aulaLarga: 'Lab. LC2', riesgo: 'alto' },
  },
  {
    id: 'WEB', nombre: 'Programación Web', corto: 'Prog. Web', cortoCal: 'Prog. Web',
    clave: 'AEB-1055', creditos: 5, grupos: 4,
    color: { bg: '#CFF0EC', bar: '#0E7C73', fg: '#0A4F49', barOscuro: '#7FD6CC' },
    grupo: { clave: 'ISC-5F', prof: 'Vásquez', profLargo: 'Mtro. Vásquez Luna', aula: 'LC4', aulaLarga: 'Lab. LC4', riesgo: 'bajo' },
  },
  {
    id: 'FIS', nombre: 'Fund. de Ingeniería de Software', corto: 'Ing. Software', cortoCal: 'Ing. Soft.',
    clave: 'SCC-1007', creditos: 4, grupos: 2,
    color: { bg: '#FBD9E6', bar: '#B8306A', fg: '#7A1C45', barOscuro: '#F5A3C4' },
    grupo: { clave: 'ISC-5C', prof: 'Jiménez', profLargo: 'Mtra. Jiménez Ortiz', aula: 'K7', aulaLarga: 'Aula K7', riesgo: 'bajo' },
  },
  {
    id: 'TEL', nombre: 'Fund. de Telecomunicaciones', corto: 'Telecom', cortoCal: 'Telecom',
    clave: 'AEC-1034', creditos: 4, grupos: 1,
    color: { bg: '#EEE9B8', bar: '#7A7000', fg: '#4D4700', barOscuro: '#D9D06A' },
    grupo: { clave: 'ISC-5E', prof: 'Ramírez', profLargo: 'Ing. Ramírez Aquino', aula: 'I2', aulaLarga: 'Aula I2', riesgo: 'medio' },
  },
  {
    id: 'DES', nombre: 'Desarrollo Sustentable', corto: 'Des. Sustentable', cortoCal: 'Des. Sust.',
    clave: 'ACD-0908', creditos: 5, grupos: 5,
    color: { bg: '#E4E7EC', bar: '#667085', fg: '#344054', barOscuro: '#98A2B3' },
    grupo: { clave: 'ISC-5J', prof: 'Por asignar', profLargo: 'Por asignar', aula: '—', aulaLarga: '—', riesgo: 'bajo' },
  },
];

export const SELECCION_INICIAL: MateriaId[] = ['ARQ', 'SIM', 'TBD', 'WEB', 'FIS', 'TEL'];

export const SIN_OFERTA = [{ nombre: 'Taller de Ética', clave: 'ACA-0907', creditos: 4 }];

export const materiaPorId = (id: MateriaId) => MATERIAS.find((m) => m.id === id)!;

/* ---------- Preferencias ---------- */

export type PesoId = 'entrada' | 'salida' | 'libres' | 'profes' | 'muertas';
export type Pesos = Record<PesoId, number>;
export type PresetId = 'compacto' | 'mananas' | 'libre';

export const PRESETS: { id: PresetId; label: string; pesos: Pesos }[] = [
  { id: 'compacto', label: 'Compacto', pesos: { entrada: 40, salida: 60, libres: 20, profes: 50, muertas: 100 } },
  { id: 'mananas', label: 'Solo mañanas', pesos: { entrada: 60, salida: 100, libres: 20, profes: 50, muertas: 60 } },
  { id: 'libre', label: 'Día libre', pesos: { entrada: 30, salida: 40, libres: 100, profes: 50, muertas: 50 } },
];

export const PREFERENCIAS: { id: PesoId; label: string; valor: (preset: PresetId | null) => string }[] = [
  { id: 'entrada', label: 'Hora de entrada', valor: () => 'Desde las 7:00' },
  { id: 'salida', label: 'Hora de salida', valor: () => 'Antes de las 14:00' },
  { id: 'libres', label: 'Días libres', valor: (p) => (p === 'libre' ? 'Viernes libre' : 'Sin preferencia') },
  { id: 'profes', label: 'Profesores preferidos', valor: () => 'Mtra. Cruz Matus' },
  { id: 'muertas', label: 'Máximo de horas muertas', valor: () => '1 h por día' },
];

export type Bloqueo = { id: string; rango: string; motivo: string };
export const BLOQUEOS_INICIALES: Bloqueo[] = [{ id: 'trabajo', rango: 'Lun a vie · 15:00–21:00', motivo: 'Trabajo' }];
export const VETADOS_INICIALES = ['Ing. Mendoza Ríos'];

/* ---------- Horarios generados ---------- */

/** Días: 1 = lunes … 5 = viernes */
const LV = [1, 2, 3, 4, 5];
const LJ = [1, 2, 3, 4];

export type Clase = { materia: MateriaId; dias: number[]; hora: number };

export type Opcion = {
  n: number;
  puntaje: number;
  entrada: string;
  salida: string;
  muertas: number;
  prefs: string;
  riesgo: Riesgo;
  clases: Clase[];
};

export const HORA_INICIO = 7;
export const HORA_FIN = 14;
export const TOTAL_COMBINACIONES = 18;

export const OPCIONES: Opcion[] = [
  {
    n: 1, puntaje: 92, entrada: '7:00', salida: '14:00', muertas: 6, prefs: '5 de 5', riesgo: 'alto',
    clases: [
      { materia: 'ARQ', dias: LV, hora: 7 }, { materia: 'SIM', dias: LV, hora: 8 }, { materia: 'TBD', dias: LJ, hora: 9 },
      { materia: 'WEB', dias: LV, hora: 11 }, { materia: 'FIS', dias: LJ, hora: 12 }, { materia: 'TEL', dias: LJ, hora: 13 },
    ],
  },
  {
    n: 2, puntaje: 88, entrada: '7:00', salida: '14:00', muertas: 4, prefs: '4 de 5', riesgo: 'medio',
    clases: [
      { materia: 'ARQ', dias: LV, hora: 7 }, { materia: 'SIM', dias: LV, hora: 8 }, { materia: 'WEB', dias: LV, hora: 9 },
      { materia: 'TBD', dias: LJ, hora: 10 }, { materia: 'FIS', dias: LJ, hora: 11 }, { materia: 'TEL', dias: LJ, hora: 13 },
    ],
  },
  {
    n: 3, puntaje: 81, entrada: '8:00', salida: '14:00', muertas: 0, prefs: '3 de 5', riesgo: 'bajo',
    clases: [
      { materia: 'SIM', dias: LV, hora: 8 }, { materia: 'ARQ', dias: LV, hora: 9 }, { materia: 'WEB', dias: LV, hora: 10 },
      { materia: 'TBD', dias: LJ, hora: 11 }, { materia: 'FIS', dias: LJ, hora: 12 }, { materia: 'TEL', dias: LJ, hora: 13 },
    ],
  },
];

export const FIJADO_INICIAL: { materia: MateriaId; clave: string } | null = { materia: 'ARQ', clave: 'ISC-5B' };

/* ---------- Grupos alternativos (hoja «Cambiar grupo» y modo reinscripción) ---------- */

export type Alternativa = Grupo & {
  hora: number;
  dias: number[];
  /** Efecto de cambiar, p. ej. «Quita 4 h muertas · 92 → 94 puntos» */
  efecto: string;
  mejora: boolean;
  /** Nota del recálculo en modo reinscripción */
  nota: string;
};

export const ALTERNATIVAS: Partial<Record<MateriaId, Alternativa[]>> = {
  TBD: [
    {
      clave: 'ISC-5G', prof: 'Ruiz T.', profLargo: 'Mtra. Ruiz Toledo', aula: 'LC1', aulaLarga: 'Lab. LC1', riesgo: 'bajo',
      hora: 10, dias: LJ, efecto: 'Quita 4 h muertas · 92 → 94 puntos', mejora: true, nota: 'Sin cruces · ocupa tu hueco de las 10:00',
    },
    {
      clave: 'ISC-5H', prof: 'Santiago', profLargo: 'Ing. Santiago Pérez', aula: 'LC2', aulaLarga: 'Lab. LC2', riesgo: 'medio',
      hora: 14, dias: LJ, efecto: 'Salida a las 15:00 · 92 → 85 puntos', mejora: false, nota: 'Sin cruces · salida a las 15:00',
    },
  ],
  SIM: [
    {
      clave: 'ISC-5K', prof: 'Ortiz V.', profLargo: 'Ing. Ortiz Vargas', aula: 'I4', aulaLarga: 'Aula I4', riesgo: 'bajo',
      hora: 10, dias: LV, efecto: 'Ocupa el hueco de las 10:00', mejora: true,
      nota: 'Sin cruces · ocupa tu hueco de las 10:00 · salida igual, 14:00',
    },
  ],
  WEB: [
    {
      clave: 'ISC-5M', prof: 'Aquino F.', profLargo: 'Mtra. Aquino Flores', aula: 'LC3', aulaLarga: 'Lab. LC3', riesgo: 'medio',
      hora: 14, dias: LV, efecto: 'Salida a las 15:00', mejora: false, nota: 'Sin cruces · salida a las 15:00',
    },
  ],
  FIS: [
    {
      clave: 'ISC-5N', prof: 'Toledo M.', profLargo: 'Ing. Toledo Marín', aula: 'K2', aulaLarga: 'Aula K2', riesgo: 'medio',
      hora: 14, dias: LJ, efecto: 'Salida a las 15:00', mejora: false, nota: 'Sin cruces · salida a las 15:00',
    },
  ],
};

/* ---------- Estado «sin combinaciones» ---------- */

export const SIN_COMBINACIONES = {
  materia: 'TEL' as MateriaId,
  horario: '15:00–16:00',
  bloqueoRelajado: 'Lun a vie · 16:00–21:00',
  combinacionesAlRelajar: 4,
  combinacionesAlQuitar: 18,
};

/* ---------- Modo reinscripción ---------- */

/** Orden de captura: primero los grupos con más riesgo de cierre. */
export const ORDEN_CAPTURA: MateriaId[] = ['ARQ', 'TBD', 'TEL', 'SIM', 'WEB', 'FIS'];
export const YA_INSCRITAS: MateriaId[] = ['ARQ', 'TBD', 'TEL'];
export const TURNO = { abrio: '10:20', segundosRestantes: 702 };

export const rangoDias = (dias: number[]) => (dias.length === 5 ? 'Lun a vie' : 'Lun a jue');
