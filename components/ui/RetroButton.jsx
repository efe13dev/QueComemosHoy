import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { hardShadow, outline, theme } from "../../utils/theme";

export default function RetroButton({
  title,
  children,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = "primary",
}) {
  const variantBg =
    {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
      success: theme.colors.success,
      danger: theme.colors.danger,
    }[variant] || theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: variantBg },
        outline({ width: 3 }),
        hardShadow({ x: 4, y: 4, elevation: 8 }),
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {children ? (
          children
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    transform: [{ translateY: -1 }],
  },
  text: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
});
