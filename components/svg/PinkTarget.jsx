import React from "react";
import Svg, { Circle } from "react-native-svg";

const PinkTarget = ({ style, opacity = 0.08, outer = "#FF69B4", inner = "white", stroke = "#000", strokeWidth = 6 }) => (
  <Svg
    viewBox="0 0 160 160"
    width="100%"
    height="100%"
    style={style}
    pointerEvents="none"
    opacity={opacity}
    preserveAspectRatio="xMidYMid slice"
  >
    <Circle cx="80" cy="80" r="70" fill={outer} stroke={stroke} strokeWidth={strokeWidth} />
    <Circle cx="80" cy="80" r="30" fill={inner} stroke={stroke} strokeWidth={strokeWidth} />
  </Svg>
);

export default PinkTarget;
