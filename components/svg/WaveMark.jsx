import React from "react";
import Svg, { Path } from "react-native-svg";

const WaveMark = ({ style, opacity = 0.1, color = "#000", strokeWidth = 8 }) => (
  <Svg
    viewBox="0 0 120 200"
    width="100%"
    height="100%"
    style={style}
    pointerEvents="none"
    opacity={opacity}
    preserveAspectRatio="xMidYMid slice"
  >
    <Path
      d="M 60 10 Q 100 25 60 40 Q 20 55 60 70 Q 100 85 60 100 Q 20 115 60 130 Q 100 145 60 160 Q 20 175 60 190"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </Svg>
);

export default WaveMark;
