import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

import splashImage from "../assets/splash_image.png";
import { hardShadow, outline, theme } from "../utils/theme";

const { width, height } = Dimensions.get("window");
const LETTER_DELAY = 55;

// Definimos animaciones personalizadas (neobrutalistas)
Animatable.initializeRegistryWithDefinitions({
  // Entrada dramática con bounce neobrutalista
  brutalBounce: {
    0: { opacity: 0, scale: 0.3, rotate: "-15deg" },
    0.5: { opacity: 0.8, scale: 1.2, rotate: "5deg" },
    0.75: { opacity: 1, scale: 0.95, rotate: "-2deg" },
    1: { opacity: 1, scale: 1, rotate: "0deg" },
  },
  // Pop-in contundente con más impacto
  popInThicc: {
    0: { opacity: 0, scale: 0.4, translateY: 30, rotate: "-10deg" },
    0.6: { opacity: 1, scale: 1.15, translateY: -5, rotate: "3deg" },
    0.85: { opacity: 1, scale: 0.98, translateY: 2, rotate: "-1deg" },
    1: { opacity: 1, scale: 1, translateY: 0, rotate: "0deg" },
  },
  // Slide up con snap más agresivo
  slideUpSnap: {
    0: { opacity: 0, translateY: 50, skewX: "5deg" },
    0.7: { opacity: 1, translateY: -8, skewX: "-2deg" },
    1: { opacity: 1, translateY: 0, skewX: "0deg" },
  },
  // Wiggle más pronunciado para subtítulo
  wiggleSkew: {
    0: { rotate: "-5deg", skewX: "-8deg", scale: 0.95 },
    0.3: { rotate: "3deg", skewX: "5deg", scale: 1.02 },
    0.6: { rotate: "-2deg", skewX: "-3deg", scale: 0.98 },
    1: { rotate: "0deg", skewX: "0deg", scale: 1 },
  },
  // Animación para el badge con efecto punch
  badgePunch: {
    0: { opacity: 0, scale: 0.2, rotate: "45deg" },
    0.5: { opacity: 1, scale: 1.3, rotate: "-10deg" },
    0.75: { opacity: 1, scale: 0.9, rotate: "5deg" },
    1: { opacity: 1, scale: 1, rotate: "0deg" },
  },
  // Shake sutil para letras
  letterShake: {
    0: { translateX: 0, translateY: 0 },
    0.25: { translateX: -1, translateY: 1 },
    0.5: { translateX: 1, translateY: -1 },
    0.75: { translateX: -1, translateY: 0 },
    1: { translateX: 0, translateY: 0 },
  },
  // Pulso duro y breve para elementos contundentes (badge)
  neoPulse: {
    0: { scale: 1, translateX: 0, translateY: 0 },
    0.2: { scale: 1.05, translateX: -1, translateY: 1 },
    0.4: { scale: 1, translateX: 0, translateY: 0 },
    0.6: { scale: 1.04, translateX: 1, translateY: -1 },
    0.8: { scale: 1, translateX: 0, translateY: 0 },
    1: { scale: 1.02, translateX: 0, translateY: 0 },
  },
  // Glitch con skew y jitter para subtítulo
  taglineGlitch: {
    0: { translateX: 0, skewX: "0deg", opacity: 1 },
    0.12: { translateX: -1.5, skewX: "-6deg", opacity: 0.95 },
    0.24: { translateX: 2, skewX: "5deg", opacity: 1 },
    0.36: { translateX: -0.8, skewX: "-3deg", opacity: 0.98 },
    0.6: { translateX: 1, skewX: "2deg", opacity: 1 },
    0.72: { translateX: -1, skewX: "-2deg", opacity: 0.97 },
    1: { translateX: 0, skewX: "0deg", opacity: 1 },
  },
});

// Componente para cada letra animada (con sombra duplicada para Android/iOS)
const AnimatedLetter = ({ letter, index, totalLetters, fontFamily, color }) => {
  return (
    <Animatable.View
      style={styles.letterWrapper}
      animation={{
        from: { opacity: 0, translateY: 15, scale: 0.8, rotate: "-5deg" },
        to: { opacity: 1, translateY: 0, scale: 1, rotate: "0deg" },
      }}
      duration={400}
      delay={index * LETTER_DELAY}
      useNativeDriver
    >
      {/* Sombra múltiple para efecto más dramático */}
      <Text
        allowFontScaling={false}
        style={[
          styles.letter,
          styles.letterShadowFar,
          fontFamily ? { fontFamily } : null,
        ]}
      >
        {letter}
      </Text>
      <Text
        allowFontScaling={false}
        style={[
          styles.letter,
          styles.letterShadowNear,
          fontFamily ? { fontFamily } : null,
        ]}
      >
        {letter}
      </Text>
      <Text
        allowFontScaling={false}
        style={[
          styles.letter,
          color ? { color } : null,
          fontFamily ? { fontFamily } : null,
        ]}
      >
        {letter}
      </Text>
    </Animatable.View>
  );
};

const SplashScreen = () => {
  const [letters, setLetters] = useState([]);
  const [containerW, setContainerW] = useState(0);
  const [contentW, setContentW] = useState(0);
  const scale =
    containerW > 0 && contentW > 0
      ? Math.min(1, (containerW - 8) / contentW)
      : 1;

  // Fuente Mario: usaremos "New Super Mario Font U".
  // Para que funcione, coloca `assets/fonts/NewSuperMarioFontU.ttf` y cárgala con Expo (expo-font).
  // Mientras tanto, usar el nombre de la familia permite que, si ya está instalada, se aplique.
  const marioFont = "NewSuperMarioFontU";

  // Colores por letra (paleta neobrutalista del tema)
  const marioColors = [
    theme.colors.accent, // rojo
    theme.colors.primary, // amarillo
    theme.colors.success, // verde
    theme.colors.secondary, // violeta
  ];

  useEffect(() => {
    // Texto a animar letra por letra
    const text = "¿Qué comemos hoy?";

    // Crear un array con cada letra y un ID único
    setLetters(
      text.split("").map((letter, index) => ({
        id: `letter-${index}-${Math.random().toString(36).substr(2, 9)}`,
        value: letter,
        color:
          letter.trim().length === 0
            ? undefined
            : marioColors[index % marioColors.length],
      })),
    );
  }, []);

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surfaceAlt]}
      style={styles.container}
    >
      <Animatable.Image
        source={splashImage}
        style={styles.image}
        animation="brutalBounce"
        useNativeDriver
        duration={1800}
      />
      <Animatable.View
        style={styles.textContainer}
        animation="slideUpSnap"
        delay={200}
        duration={700}
        useNativeDriver
        onLayout={(e) => {
          if (containerW === 0) setContainerW(e.nativeEvent.layout.width);
        }}
      >
        <View
          onLayout={(e) => {
            if (contentW === 0) setContentW(e.nativeEvent.layout.width);
          }}
          style={[styles.contentRow, { transform: [{ scale }] }]}
        >
          {letters.map((letterObj, idx) => (
            <AnimatedLetter
              key={letterObj.id}
              letter={letterObj.value}
              index={idx}
              totalLetters={letters.length}
              fontFamily={marioFont}
              color={letterObj.color}
            />
          ))}
        </View>
        {/* Badge 3.0 */}
        <Animatable.View
          animation="badgePunch"
          delay={letters.length * LETTER_DELAY + 200}
          duration={650}
          useNativeDriver
          style={styles.versionBadge}
        >
          <View style={styles.textStack}>
            <Text
              allowFontScaling={false}
              style={[
                styles.versionText,
                styles.versionShadow,
                { fontFamily: marioFont },
              ]}
            >
              3.2.1
            </Text>
            <Animatable.Text
              allowFontScaling={false}
              animation="neoPulse"
              iterationCount="infinite"
              duration={1100}
              direction="alternate"
              useNativeDriver
              style={[styles.versionText, { fontFamily: marioFont }]}
            >
              3.2.1
            </Animatable.Text>
          </View>
        </Animatable.View>

        {/* Subtítulo */}
        <Animatable.View
          animation="slideUpSnap"
          delay={letters.length * LETTER_DELAY + 400}
          duration={750}
          useNativeDriver
          style={styles.taglineContainer}
        >
          <View style={styles.textStack}>
            <Text
              allowFontScaling={false}
              style={[
                styles.taglineText,
                styles.taglineShadow,
                { fontFamily: marioFont },
              ]}
            >
              neobrutalist version
            </Text>
            <Animatable.Text
              allowFontScaling={false}
              animation="taglineGlitch"
              iterationCount="infinite"
              duration={1200}
              direction="alternate"
              useNativeDriver={false}
              style={[styles.taglineText, { fontFamily: marioFont }]}
            >
              neobrutalist version
            </Animatable.Text>
          </View>
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: height * 0.15,
  },
  image: {
    width: width * 0.9,
    height: height * 0.55,
    resizeMode: "contain",
    marginBottom: -50,
  },
  textContainer: {
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.95,
    paddingHorizontal: 5,
    overflow: "visible",
  },
  contentRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
  },
  textStack: {
    position: "relative",
    padding: 0,
  },
  letterWrapper: {
    position: "relative",
    overflow: "visible",
    marginRight: 3,
    marginBottom: 3,
  },
  letter: {
    fontSize: 34,
    // El color y la fuente se inyectan por letra
    includeFontPadding: false,
    lineHeight: 38,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  letterShadowFar: {
    color: "#000000",
    position: "absolute",
    left: 4,
    top: 4,
    backgroundColor: "transparent",
    zIndex: 0,
    opacity: 0.9,
  },
  letterShadowNear: {
    color: "#000000",
    position: "absolute",
    left: 2,
    top: 2,
    backgroundColor: "transparent",
    zIndex: 0,
    opacity: 0.8,
  },
  versionBadge: {
    marginTop: height * 0.1,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
    position: "relative",
  },
  versionText: {
    fontSize: 18,
    color: theme.colors.ink,
    includeFontPadding: false,
    lineHeight: 22,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    zIndex: 1,
  },
  versionShadow: {
    color: "#000000",
    position: "absolute",
    left: 0,
    top: 0,
    transform: [{ translateX: 0.5 }, { translateY: 0.5 }],
    zIndex: 0,
    opacity: 0.9,
  },
  taglineContainer: {
    marginTop: 24,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary,
    ...outline({ width: 2 }),
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
    position: "relative",
  },
  taglineText: {
    fontSize: 12,
    color: theme.colors.surface,
    includeFontPadding: false,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "lowercase",
    zIndex: 1,
  },
  taglineShadow: {
    color: "#000000",
    position: "absolute",
    left: 0,
    top: 0,
    transform: [{ translateX: 1 }, { translateY: 1 }],
    zIndex: 0,
    opacity: 0.9,
  },
});

export default SplashScreen;
