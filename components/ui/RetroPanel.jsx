import React from "react";
import { StyleSheet, View } from "react-native";

import { outline, hardShadow, theme } from "../../utils/theme";

export default function RetroPanel({ children, style, padding = "md" }) {
  const pad =
    {
      xs: theme.spacing.xs,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
      xl: theme.spacing.xl,
    }[padding] || theme.spacing.md;

  return <View style={[styles.base, { padding: pad }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
});
