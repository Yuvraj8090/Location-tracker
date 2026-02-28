// ─────────────────────────────────────────────────────────────────────────────
// FIELDTRACK – Theme Constants
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  bg: '#0A0E1A',
  surface: '#111827',
  card: '#1A2235',
  cardHover: '#1F2B40',
  border: '#1E2D45',
  accent: '#00C2FF',
  accentDim: '#0096CC',
  accentGlow: 'rgba(0,194,255,0.15)',
  success: '#00E5A0',
  successDim: 'rgba(0,229,160,0.12)',
  warning: '#FFB830',
  warningDim: 'rgba(255,184,48,0.12)',
  danger: '#FF4757',
  dangerDim: 'rgba(255,71,87,0.12)',
  textPrimary: '#F0F4FF',
  textSecondary: '#7A8BAD',
  textMuted: '#3E5070',
  purple: '#7C4DFF',
  purpleDim: 'rgba(124,77,255,0.12)',
} as const;

export const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  assigned: { bg: Colors.warningDim, text: Colors.warning, dot: Colors.warning },
  started:  { bg: Colors.accentGlow, text: Colors.accent,  dot: Colors.accent  },
  completed:{ bg: Colors.successDim, text: Colors.success, dot: Colors.success },
  reached:  { bg: Colors.purpleDim,  text: Colors.purple,  dot: Colors.purple  },
};

export const priorityColors: Record<string, string> = {
  high:   Colors.danger,
  medium: Colors.warning,
  low:    Colors.success,
};

export const Typography = {
  // Use system monospace / sans-serif (custom fonts via expo-google-fonts optional)
  mono: 'Courier' as const,        // swap with 'SpaceMono' if using expo-google-fonts
  heading: undefined as undefined, // undefined = system font (bold weight used)
  body: undefined as undefined,
};
