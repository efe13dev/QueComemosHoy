// Tema base retro para la app
// Provee tokens de color, radios, espaciados y utilidades de estilo

export const theme = {
  colors: {
    // Base neobrutalista: alto contraste y colores saturados
    background: "#F5F5F5", // blanco periódico suave, elimina tonos salmón
    surface: "#FFFFFF",
    surfaceAlt: "#FFFFFF",
    surfaceElevated: "#F0F0F0",

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
  fontSize: {
    xs: 11,
    sm: 13,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
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

// Genera estilos para títulos neobrutalistas con sombras múltiples
export const neoTitleStyles = ({
  fontSize = theme.fontSize.xl,
  color = theme.colors.textDark,
  shadowColor = theme.colors.primary,
  offset = 2,
} = {}) => {
  const base = {
    fontSize,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    color,
  };
  const abs = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  };

  return {
    wrap: { position: "relative", alignItems: "center" },
    main: {
      ...base,
      textShadowColor: shadowColor,
      textShadowOffset: { width: offset, height: offset },
      textShadowRadius: 0,
      zIndex: 1,
    },
    shadow1: {
      ...base,
      ...abs,
      color: shadowColor,
      transform: [{ translateX: offset }, { translateY: offset }],
    },
    shadow2: {
      ...base,
      ...abs,
      color: shadowColor,
      transform: [{ translateX: -offset }, { translateY: 0 }],
    },
    shadow3: {
      ...base,
      ...abs,
      color: shadowColor,
      transform: [{ translateX: 0 }, { translateY: -offset }],
    },
    shadow4: {
      ...base,
      ...abs,
      color: shadowColor,
      transform: [{ translateX: -offset }, { translateY: -offset }],
    },
  };
};

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
