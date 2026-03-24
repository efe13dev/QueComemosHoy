import { useWindowDimensions } from "react-native";

const NARROW_BREAKPOINT = 380;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isNarrow = width < NARROW_BREAKPOINT;
  const isTall = height > 800;
  const scale = isNarrow ? 0.85 : 1;

  return {
    isNarrow,
    isTall,
    screenWidth: width,
    screenHeight: height,
    scale,
  };
}
