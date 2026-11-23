export const colors = {
  bg: '#F5F6F8',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  chip: '#F2F4F7',
  ink: '#101828',
  text2: '#344054',
  text3: '#475467',
  mute: '#667085',
  border: '#E4E7EC',
  divider: '#EEF0F3',
  borderMid: '#D0D5DD',
  borderStrong: '#98A2B3',
  primary: '#1F3FBF',
  primaryBg: '#EEF2FF',
  primaryBorder: '#B4C2F0',
  ok: '#14532D',
  warn: '#7A4B00',
  danger: '#8A1C1C',
  gapBorder: '#B54708',
  gapBg: '#FFF6E5',
  gapFg: '#7A2E0E',
  // Modo reinscripción (oscuro)
  night: '#0B1220',
  nightRow: '#141D2F',
  nightCard: '#1B2740',
  nightBorder: '#5B7BE8',
  nightText: '#D0D5DD',
  nightLink: '#B4C6FF',
  green: '#4ADE80',
  greenInk: '#052E16',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  display: 'SpaceGrotesk_700Bold',
  mono: 'JetBrainsMono_700Bold',
} as const;

export type Riesgo = 'alto' | 'medio' | 'bajo';

export const riesgo: Record<Riesgo, { corto: string; largo: string; bg: string; fg: string }> = {
  alto: { corto: 'Alto', largo: 'Riesgo alto', bg: '#FDDCDC', fg: '#8A1C1C' },
  medio: { corto: 'Medio', largo: 'Riesgo medio', bg: '#FDECC8', fg: '#7A4B00' },
  bajo: { corto: 'Bajo', largo: 'Riesgo bajo', bg: '#DDF3E4', fg: '#14532D' },
};

export const cerrado = { bg: '#E4E7EC', fg: '#344054' };
