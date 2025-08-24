import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { outline, hardShadow, theme } from "../../utils/theme";

export default function RetroInput({
  style,
  containerStyle,
  placeholderTextColor,
  ...props
}) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor || theme.colors.textMuted}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  input: {
    height: 50,
    paddingHorizontal: 14,
    color: theme.colors.ink,
  },
});
