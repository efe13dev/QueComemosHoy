import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

const SEASON_THEME = {
  spring: {
    trunk: "#714B3B",
    trunkLight: "#9C6B55",
    canopyA: "#74D874",
    canopyB: "#48B95A",
    accent: ["#FF8FB8", "#FFD166", "#8FD3FF", "#C9A0FF"],
    badge: "#FF7FB0",
    badgeAccent: "#FFF1F6",
  },
  summer: {
    trunk: "#654235",
    trunkLight: "#8A5A46",
    canopyA: "#32A852",
    canopyB: "#227C3E",
    accent: ["#FF5A4F", "#FFC93C", "#FF7A00"],
    badge: "#FFD84D",
    badgeAccent: "#FFF6CC",
  },
  autumn: {
    trunk: "#654235",
    trunkLight: "#8B5A46",
    canopyA: "#FF9A2E",
    canopyB: "#E86422",
    accent: ["#FF6B35", "#FFB347", "#D94A1E"],
    badge: "#FF8C42",
    badgeAccent: "#FFF0D8",
  },
  winter: {
    trunk: "#5A4038",
    trunkLight: "#7A5A51",
    canopyA: "#BFD7EA",
    canopyB: "#EAF4FB",
    accent: ["#FFFFFF", "#D7ECFF", "#F4FAFF"],
    badge: "#86C5FF",
    badgeAccent: "#F4FBFF",
  },
};

const CANOPY_BLOBS = [
  { cx: 80, cy: 54, rx: 34, ry: 22 },
  { cx: 53, cy: 66, rx: 23, ry: 18 },
  { cx: 107, cy: 67, rx: 24, ry: 18 },
  { cx: 80, cy: 31, rx: 21, ry: 17 },
  { cx: 65, cy: 82, rx: 18, ry: 13 },
  { cx: 95, cy: 82, rx: 18, ry: 13 },
];

const STICKER_ICONS = {
  spring: (
    <>
      <Circle
        cx="122"
        cy="24"
        r="4"
        fill="#FFF1F6"
        stroke="#1F1F1F"
        strokeWidth="2"
      />
      <Circle
        cx="116"
        cy="30"
        r="4"
        fill="#FFD166"
        stroke="#1F1F1F"
        strokeWidth="2"
      />
      <Circle
        cx="128"
        cy="30"
        r="4"
        fill="#8FD3FF"
        stroke="#1F1F1F"
        strokeWidth="2"
      />
      <Circle
        cx="122"
        cy="36"
        r="4"
        fill="#C9A0FF"
        stroke="#1F1F1F"
        strokeWidth="2"
      />
    </>
  ),
  summer: (
    <>
      <Circle
        cx="122"
        cy="30"
        r="8"
        fill="#FFF176"
        stroke="#1F1F1F"
        strokeWidth="2.5"
      />
      <Path
        d="M122 16 L122 9 M122 51 L122 44 M108 30 L101 30 M143 30 L136 30 M112 20 L107 15 M132 20 L137 15 M112 40 L107 45 M132 40 L137 45"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  ),
  autumn: (
    <Path
      d="M122 18 Q130 24 128 32 Q126 40 122 44 Q118 40 116 32 Q114 24 122 18Z"
      fill="#FFD089"
      stroke="#1F1F1F"
      strokeWidth="2.5"
    />
  ),
  winter: (
    <Path
      d="M122 16 L122 44 M108 30 L136 30 M112 20 L132 40 M132 20 L112 40"
      stroke="#1F1F1F"
      strokeWidth="3"
      strokeLinecap="round"
    />
  ),
};

const SeasonalTree = ({
  size = 120,
  season = "spring",
  rotation = 0,
  flowerScaleValue: _flowerScaleValue = 1,
}) => {
  const viewBox = "0 0 160 160";
  const colors = SEASON_THEME[season] || SEASON_THEME.spring;

  const renderCanopy = (
    offsetX = 0,
    offsetY = 0,
    fillA = colors.canopyA,
    fillB = colors.canopyB,
    opacity = 1,
  ) => (
    <G opacity={opacity}>
      {CANOPY_BLOBS.map((blob, index) => (
        <Ellipse
          key={`blob_${offsetX}_${offsetY}_${index}`}
          cx={blob.cx + offsetX}
          cy={blob.cy + offsetY}
          rx={blob.rx}
          ry={blob.ry}
          fill={index % 2 === 0 ? fillA : fillB}
          stroke="#1F1F1F"
          strokeWidth="3"
        />
      ))}
    </G>
  );

  const renderSeasonAccents = () => {
    if (season === "spring") {
      return [
        { cx: 62, cy: 44, r: 4, color: colors.accent[0] },
        { cx: 98, cy: 44, r: 4, color: colors.accent[1] },
        { cx: 78, cy: 62, r: 4.5, color: colors.accent[2] },
        { cx: 47, cy: 69, r: 3.5, color: colors.accent[3] },
        { cx: 112, cy: 70, r: 3.5, color: colors.accent[0] },
        { cx: 80, cy: 30, r: 4, color: colors.accent[1] },
      ].map((item, index) => (
        <G key={`accent_${index}`}>
          <Circle
            cx={item.cx}
            cy={item.cy}
            r={item.r}
            fill={item.color}
            stroke="#1F1F1F"
            strokeWidth="1.8"
          />
          <Circle cx={item.cx} cy={item.cy} r={item.r * 0.35} fill="#FFFDFD" />
        </G>
      ));
    }

    if (season === "summer") {
      return [
        { cx: 63, cy: 53, r: 4.2, color: colors.accent[0] },
        { cx: 95, cy: 54, r: 4.2, color: colors.accent[1] },
        { cx: 79, cy: 71, r: 4, color: colors.accent[2] },
        { cx: 50, cy: 73, r: 3.5, color: colors.accent[0] },
        { cx: 109, cy: 73, r: 3.5, color: colors.accent[1] },
      ].map((item, index) => (
        <G key={`accent_${index}`}>
          <Circle
            cx={item.cx}
            cy={item.cy}
            r={item.r}
            fill={item.color}
            stroke="#1F1F1F"
            strokeWidth="1.8"
          />
          <Path
            d={`M${item.cx} ${item.cy - item.r - 2} Q${item.cx + 2} ${item.cy - item.r - 6} ${item.cx + 6} ${item.cy - item.r - 4}`}
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </G>
      ));
    }

    if (season === "autumn") {
      return [
        { x: 38, y: 110, color: colors.accent[0] },
        { x: 57, y: 118, color: colors.accent[1] },
        { x: 78, y: 112, color: colors.accent[2] },
        { x: 101, y: 119, color: colors.accent[0] },
        { x: 121, y: 112, color: colors.accent[1] },
      ].map((item, index) => (
        <Path
          key={`accent_${index}`}
          d={`M${item.x} ${item.y} Q${item.x + 6} ${item.y - 8} ${item.x + 12} ${item.y} Q${item.x + 6} ${item.y + 8} ${item.x} ${item.y}Z`}
          fill={item.color}
          stroke="#1F1F1F"
          strokeWidth="2"
        />
      ));
    }

    return [
      { cx: 56, cy: 50, r: 7 },
      { cx: 80, cy: 36, r: 8 },
      { cx: 102, cy: 53, r: 7 },
      { cx: 67, cy: 72, r: 6 },
      { cx: 95, cy: 74, r: 6 },
    ].map((item, index) => (
      <Circle
        key={`accent_${index}`}
        cx={item.cx}
        cy={item.cy}
        r={item.r}
        fill={colors.accent[index % colors.accent.length]}
        stroke="#1F1F1F"
        strokeWidth="2"
      />
    ));
  };

  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      <Defs>
        <LinearGradient id="canopyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.canopyA} />
          <Stop offset="100%" stopColor={colors.canopyB} />
        </LinearGradient>
        <LinearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.trunkLight} />
          <Stop offset="100%" stopColor={colors.trunk} />
        </LinearGradient>
      </Defs>
      <G transform={`rotate(${rotation} 80 82)`}>
        <Ellipse
          cx="84"
          cy="136"
          rx="42"
          ry="11"
          fill="#1F1F1F"
          opacity="0.16"
        />
        <G transform="translate(5 5)" opacity="0.18">
          <Path
            d="M72 124 Q72 96 76 76 L84 76 Q88 96 88 124 Z"
            fill="#1F1F1F"
          />
          <Path
            d="M80 78 Q55 68 42 45"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M80 78 Q105 68 118 45"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M80 60 Q64 44 58 24"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <Path
            d="M80 60 Q96 44 102 24"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </G>
        {renderCanopy(4, 4, "#1F1F1F", "#1F1F1F", 0.18)}
        <Path
          d="M72 124 Q72 96 76 76 L84 76 Q88 96 88 124 Z"
          fill="url(#trunkGradient)"
          stroke="#1F1F1F"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <Path
          d="M80 78 Q55 68 42 45"
          fill="none"
          stroke={colors.trunk}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <Path
          d="M80 78 Q105 68 118 45"
          fill="none"
          stroke={colors.trunk}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <Path
          d="M80 60 Q64 44 58 24"
          fill="none"
          stroke={colors.trunk}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <Path
          d="M80 60 Q96 44 102 24"
          fill="none"
          stroke={colors.trunk}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {renderCanopy(0, 0, "url(#canopyGradient)", colors.canopyA)}
        <Ellipse
          cx="80"
          cy="54"
          rx="28"
          ry="16"
          fill="#FFFFFF"
          opacity="0.12"
        />
        {renderSeasonAccents()}
        <Rect
          x="108"
          y="10"
          width="28"
          height="28"
          rx="6"
          ry="6"
          fill={colors.badge}
          stroke="#1F1F1F"
          strokeWidth="3"
        />
        <Rect
          x="114"
          y="16"
          width="16"
          height="16"
          rx="4"
          ry="4"
          fill={colors.badgeAccent}
          stroke="#1F1F1F"
          strokeWidth="2"
        />
        {STICKER_ICONS[season]}
        <Rect
          x="58"
          y="124"
          width="44"
          height="10"
          rx="2"
          ry="2"
          fill={season === "winter" ? "#F2F8FC" : "#FFD46C"}
          stroke="#1F1F1F"
          strokeWidth="3"
        />
      </G>
    </Svg>
  );
};

export default SeasonalTree;
