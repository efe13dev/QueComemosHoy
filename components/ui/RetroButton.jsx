import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { outline, theme } from "../../utils/theme";

export default function RetroButton({
  title,
  children,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = "primary",
  bgColor,
  shadowOffset,
  shadowColor,
  shadowPadding = "both", // "both" | "right"
  shadowMode = "block", // "block" | "rightBar"
  outlineSides = "all", // "all" | "rightBottom"
  disabledBgColor,
}) {
  const variantBg =
    {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
      success: theme.colors.success,
      danger: theme.colors.danger,
    }[variant] || theme.colors.primary;

  // Offsets de sombra personalizables (por defecto sin desplazamiento horizontal)
  const offsetDefaultX = shadowOffset?.default?.x ?? 0;
  const offsetDefaultY = shadowOffset?.default?.y ?? 3;
  const offsetPressedX = shadowOffset?.pressed?.x ?? 0;
  const offsetPressedY = shadowOffset?.pressed?.y ?? 2;
  const shadowBg = shadowColor || theme.colors.border;
  // Usamos el width del estilo externo en el wrapper y no en la superficie
  const flatStyle = StyleSheet.flatten(style) || {};
  const {
    width: buttonWidth,
    backgroundColor: externalBg,
    ...restSurfaceStyle
  } = flatStyle;
  const reserveRightOnly = shadowPadding === "right";
  const isRightBar = shadowMode === "rightBar";

  // Control de bordes (outline) para estilo neobrutalista
  const borderWidth = 3;
  const surfaceOutlineStyle =
    outlineSides === "all"
      ? outline({ width: borderWidth })
      : {
          borderColor: theme.colors.border,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderRightWidth: borderWidth,
          borderBottomWidth: borderWidth,
        };

  // Color de fondo final: deshabilitado tiene prioridad; si no, usa bgColor prop, luego el del estilo, luego el del variant
  const baseBg = bgColor ?? externalBg ?? variantBg;
  const currentBg =
    disabled && disabledBgColor != null ? disabledBgColor : baseBg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.wrapper,
        buttonWidth != null && { width: buttonWidth, alignSelf: "center" },
        disabled && styles.disabled,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.layerWrap,
            {
              paddingLeft: disabled
                ? 0
                : reserveRightOnly
                  ? 0
                  : pressed
                    ? offsetPressedX
                    : offsetDefaultX,
              paddingRight: disabled
                ? 0
                : pressed
                  ? offsetPressedX
                  : offsetDefaultX,
              paddingBottom: disabled
                ? 0
                : reserveRightOnly
                  ? 0
                  : pressed
                    ? offsetPressedY
                    : offsetDefaultY,
            },
          ]}
        >
          {/* Capa de sombra dura (neobrutal) */}
          {!disabled && (
            <View
              pointerEvents="none"
              style={[
                styles.shadowBlock,
                { backgroundColor: shadowBg },
                isRightBar
                  ? [
                      styles.rightBar,
                      {
                        width: Math.max(
                          2,
                          (pressed ? offsetPressedX : offsetDefaultX) + 2,
                        ),
                      },
                    ]
                  : pressed
                    ? {
                        transform: [
                          { translateX: offsetPressedX },
                          { translateY: offsetPressedY },
                        ],
                      }
                    : {
                        transform: [
                          { translateX: offsetDefaultX },
                          { translateY: offsetDefaultY },
                        ],
                      },
              ]}
            />
          )}
          {/* Superficie del botón */}
          <View
            style={[
              styles.surface,
              surfaceOutlineStyle,
              pressed && styles.surfacePressed,
              restSurfaceStyle, // estilos externos (sin width) aplican a la superficie (paddings, etc.)
              { backgroundColor: currentBg },
            ]}
          >
            {children ? (
              children
            ) : (
              <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  layerWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    // El espacio para la sombra se controla dinámicamente según shadowOffset
    alignSelf: "stretch",
  },
  shadowBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    zIndex: 0,
  },
  shadowBlockDefault: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  shadowBlockPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  surface: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    alignSelf: "stretch",
  },
  surfacePressed: {
    transform: [{ translateY: 1 }],
  },
  text: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
