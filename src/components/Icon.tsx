import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const ICONS = {
  materias: <Path d="M4 6h16M4 12h16M4 18h10" />,
  horarios: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="2" />
      <Path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  sinHorarios: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="2" />
      <Path d="M3 10h18M8 3v4M16 3v4M9.5 13.5l5 5M14.5 13.5l-5 5" />
    </>
  ),
  planes: <Path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  enVivo: <Path d="M3 12h4l3-7 4 14 3-7h4" />,
  perfil: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  check: <Path d="M5 12l5 5 9-10" />,
  atras: <Path d="M15 5l-7 7 7 7" />,
  adelante: <Path d="M9 5l7 7-7 7" />,
  abajo: <Path d="M6 9l6 6 6-6" />,
  cerrar: <Path d="M6 6l12 12M18 6L6 18" />,
  pin: <Path d="M12 17v5M8 3h8l-1 7 3 4H6l3-4-1-7z" />,
  copiar: (
    <>
      <Rect x="9" y="9" width="11" height="11" rx="2" />
      <Path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </>
  ),
  sinConexion: <Path d="M3 3l18 18M5 12.5a10 10 0 0 1 4-2.6M19 12.5a10 10 0 0 0-5-2.9M8.5 16a5 5 0 0 1 7 0M12 20h.01" />,
} as const;

export type IconName = keyof typeof ICONS;

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 22, color = '#101828', strokeWidth = 2 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {ICONS[name]}
    </Svg>
  );
}
