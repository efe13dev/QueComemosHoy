import React, { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { outline, hardShadow, theme } from "../../utils/theme";

export default function RetroInput({
  style,
  containerStyle,
  placeholderTextColor,
  autoGrow = false,
  ...props
}) {
  const {
    multiline: multilineProp,
    onContentSizeChange: onContentSizeChangeProp,
    ...restProps
  } = props;
  const [contentHeight, setContentHeight] = useState(0);
  const minHeight = 50;

  const handleContentSizeChange = (event) => {
    if (autoGrow) {
      setContentHeight(event?.nativeEvent?.contentSize?.height ?? 0);
    }

    if (onContentSizeChangeProp) {
      onContentSizeChangeProp(event);
    }
  };

  const resolvedMultiline = useMemo(
    () => (multilineProp !== undefined ? multilineProp : autoGrow),
    [autoGrow, multilineProp],
  );

  const computedInputStyle = [
    styles.input,
    resolvedMultiline && styles.inputMultiline,
    autoGrow && contentHeight
      ? {
          height: Math.max(minHeight, contentHeight + 12),
        }
      : { minHeight },
    style,
  ];

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        {...restProps}
        multiline={resolvedMultiline}
        onContentSizeChange={
          autoGrow ? handleContentSizeChange : onContentSizeChangeProp
        }
        placeholderTextColor={placeholderTextColor || theme.colors.textMuted}
        style={computedInputStyle}
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
    minHeight: 50,
    paddingHorizontal: 14,
    color: theme.colors.ink,
  },
  inputMultiline: {
    paddingVertical: 12,
    textAlignVertical: "top",
  },
});
