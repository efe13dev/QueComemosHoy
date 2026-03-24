import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { useResponsive } from "../../hooks/useResponsive";

const neoColors = {
  yellow: "#FFB703",
  orange: "#FF8C42",
  red: "#FF4D4D",
  pink: "#FF6B9D",
  purple: "#A855F7",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  green: "#22C55E",
  lime: "#84CC16",
};

const decorativeItems = [
  {
    icon: "food-apple",
    size: 38,
    color: neoColors.red,
    top: "6%",
    left: "8%",
    rotation: -15,
  },
  {
    icon: "food-carrot",
    size: 30,
    color: neoColors.orange,
    top: "12%",
    left: "55%",
    rotation: 25,
  },
  {
    icon: "food-drumstick",
    size: 34,
    color: neoColors.pink,
    top: "22%",
    left: "25%",
    rotation: 10,
  },
  {
    icon: "food-steak",
    size: 42,
    color: neoColors.purple,
    top: "18%",
    left: "75%",
    rotation: -20,
  },
  {
    icon: "food-croissant",
    size: 36,
    color: neoColors.yellow,
    top: "35%",
    left: "45%",
    rotation: 15,
  },
  {
    icon: "food-pizza",
    size: 40,
    color: neoColors.blue,
    top: "45%",
    left: "12%",
    rotation: -10,
  },
  {
    icon: "silverware-fork-knife",
    size: 34,
    color: neoColors.cyan,
    top: "52%",
    left: "78%",
    rotation: 20,
  },
  {
    icon: "chef-hat",
    size: 32,
    color: neoColors.lime,
    top: "62%",
    left: "35%",
    rotation: -5,
  },
  {
    icon: "pot-steam",
    size: 38,
    color: neoColors.purple,
    top: "70%",
    left: "60%",
    rotation: 12,
  },
  {
    icon: "blender",
    size: 30,
    color: neoColors.blue,
    top: "78%",
    left: "18%",
    rotation: -18,
  },
  {
    icon: "cup",
    size: 28,
    color: neoColors.orange,
    top: "85%",
    left: "70%",
    rotation: 8,
  },
  {
    icon: "food-turkey",
    size: 36,
    color: neoColors.green,
    top: "92%",
    left: "42%",
    rotation: -25,
  },
];

export default function DecorativeFoodBackground() {
  const { isNarrow, scale } = useResponsive();

  const items = isNarrow
    ? decorativeItems.map((item) => ({
        ...item,
        size: Math.round(item.size * scale),
        color: item.color,
        rotation: item.rotation,
      }))
    : decorativeItems;

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.iconWrapper,
            isNarrow && styles.iconWrapperNarrow,
            {
              top: item.top,
              left: item.left,
              right: item.right,
              transform: [{ rotate: `${item.rotation}deg` }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={item.size}
            color={item.color}
            style={styles.iconShadow}
          />
          <MaterialCommunityIcons
            name={item.icon}
            size={item.size}
            color={item.color}
            style={styles.icon}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  iconWrapper: {
    position: "absolute",
    opacity: 0.18,
  },
  iconWrapperNarrow: {
    opacity: 0.12,
  },
  icon: {
    position: "absolute",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  iconShadow: {
    position: "absolute",
    color: "#000000",
    opacity: 0.4,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
});
