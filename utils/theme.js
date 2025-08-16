// Tema base retro para la app
// Provee tokens de color, radios, espaciados y utilidades de estilo

export const theme = {
  colors: {
    // Base neobrutalista: alto contraste y colores saturados
    background: "#F5F5F5", // blanco periódico suave, elimina tonos salmón
    surface: "#FFFFFF",
    surfaceAlt: "#FFFFFF",

    // Tinta/negro para contornos y texto
    ink: "#111111",
    textDark: "#111111",
    textMuted: "#4B5563",

    // Paleta vibrante
    primary: "#FFB703", // amarillo cálido saturado
    accent: "#FF4D4D", // rojo vivo
    success: "#22C55E", // verde vivo
    danger: "#FF1F1F", // rojo alerta
    secondary: "#8B5CF6", // violeta

    // Contornos negros gruesos por defecto
    border: "#000000",
    borderLight: "#FFEED6", // para compat con bevel retro
    borderDark: "#D2B48C",

    shadow: "rgba(0,0,0,0.9)", // sombra dura por defecto
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  elevation: {
    soft: 2,
    medium: 4,
    strong: 6,
  },
  fonts: {
    regular: "Sora_400Regular",
    medium: "Sora_600SemiBold",
    bold: "Sora_700Bold",
    extrabold: "Sora_800ExtraBold",
  },
};

// Utilidad para crear un efecto biselado retro (3D) en contenedores
export const bevel = ({
  light = theme.colors.borderLight,
  dark = theme.colors.borderDark,
  width = 1,
} = {}) => ({
  borderTopColor: light,
  borderLeftColor: light,
  borderBottomColor: dark,
  borderRightColor: dark,
  borderTopWidth: width,
  borderLeftWidth: width,
  borderBottomWidth: width,
  borderRightWidth: width,
});

// Sombra suave con compatibilidad iOS/Android
export const retroShadow = ({
  color = theme.colors.shadow,
  x = 0,
  y = 2,
  opacity = 0.25,
  radius = 3.84,
  elevation = 4,
} = {}) => ({
  shadowColor: color,
  shadowOffset: { width: x, height: y },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

// Contorno negro grueso (neobrutalismo)
export const outline = ({ color = theme.colors.border, width = 3 } = {}) => ({
  borderColor: color,
  borderWidth: width,
});

// Sombra dura sin blur (neobrutalismo)
export const hardShadow = ({
  color = theme.colors.border,
  x = 4,
  y = 4,
  opacity = 1,
  elevation = 8,
} = {}) => ({
  shadowColor: color,
  shadowOffset: { width: x, height: y },
  shadowOpacity: opacity,
  shadowRadius: 0,
  elevation,
});
