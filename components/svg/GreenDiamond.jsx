import React from "react";
import Svg, { Polygon } from "react-native-svg";

const GreenDiamond = ({
  style,
  opacity = 0.08,
  fill = "#4DFF4D",
  stroke = "#000",
  strokeWidth = 6,
}) => (
  <Svg
    viewBox="0 0 140 140"
    width="100%"
    height="100%"
    style={style}
    pointerEvents="none"
    opacity={opacity}
    preserveAspectRatio="xMidYMid slice"
  >
    <Polygon
      points="70,10 130,70 70,130 10,70"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export default GreenDiamond;
