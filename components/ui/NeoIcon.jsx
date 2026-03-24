import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { hardShadow } from "../../utils/theme";

export default function NeoIcon({
  name,
  size = 50,
  color,
  shadowColor = "#000000",
  shadowOffset = 2.5,
  style,
}) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={shadowColor}
        style={[
          styles.shadow,
          {
            transform: [
              { translateX: shadowOffset },
              { translateY: shadowOffset },
            ],
          },
        ]}
      />
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={[styles.icon, hardShadow({ x: 3, y: 3, elevation: 6 })]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  shadow: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
  },
});
