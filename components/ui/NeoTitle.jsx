import React, { useMemo } from "react";
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { neoTitleStyles } from "../../utils/theme";

export default function NeoTitle({
  text,
  fontSize,
  color,
  shadowColor,
  offset,
  style,
  animated = false,
  animationDelay = 0,
  marginBottom = 0,
}) {
  const s = useMemo(
    () => neoTitleStyles({ fontSize, color, shadowColor, offset }),
    [fontSize, color, shadowColor, offset],
  );

  const Wrapper = animated ? Animatable.Text : Text;
  const animProps = animated
    ? {
        animation: "fadeInDown",
        duration: 500,
        delay: animationDelay,
        useNativeDriver: true,
      }
    : {};

  return (
    <View style={[s.wrap, { marginBottom }, style]}>
      <Text style={s.shadow1}>{text}</Text>
      <Text style={s.shadow2}>{text}</Text>
      <Text style={s.shadow3}>{text}</Text>
      <Text style={s.shadow4}>{text}</Text>
      <Wrapper {...animProps} style={s.main}>
        {text}
      </Wrapper>
    </View>
  );
}
