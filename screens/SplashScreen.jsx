import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

import splashImage from "../assets/splash_image.png";
import { theme } from "../utils/theme";

const { width, height } = Dimensions.get("window");

// Definimos animaciones personalizadas
Animatable.initializeRegistryWithDefinitions({
  elegantEntrance: {
    from: {
      opacity: 0,
      scale: 0.8,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
  },
});

// Componente para cada letra animada (con sombra duplicada para Android/iOS)
const AnimatedLetter = ({ letter, index, totalLetters }) => {
  return (
    <Animatable.View
      style={styles.letterWrapper}
      animation={{
        from: { opacity: 0 },
        to: { opacity: 1 },
      }}
      duration={150}
      delay={index * 40}
      useNativeDriver
    >
      <Text
        allowFontScaling={false}
        style={[styles.letter, styles.letterShadow]}
      >
        {letter}
      </Text>
      <Text allowFontScaling={false} style={styles.letter}>
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

  useEffect(() => {
    // Texto a animar letra por letra
    const text = "¿Qué comemos hoy?";

    // Crear un array con cada letra y un ID único
    setLetters(
      text.split("").map((letter, index) => ({
        id: `letter-${index}-${Math.random().toString(36).substr(2, 9)}`,
        value: letter,
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
        animation="elegantEntrance"
        useNativeDriver
        duration={1200}
      />
      <Animatable.View
        style={styles.textContainer}
        animation="fadeInUp"
        delay={200}
        duration={500}
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
            />
          ))}
        </View>
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
    marginBottom: -60,
  },
  textContainer: {
    flexDirection: "row",
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
  letterWrapper: {
    position: "relative",
    overflow: "visible",
    marginRight: 3,
    marginBottom: 3,
  },
  letter: {
    fontSize: 34,
    color: theme.colors.primary,
    fontFamily: theme.fonts.extrabold,
    includeFontPadding: false,
    lineHeight: 38,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  letterShadow: {
    color: "#000000",
    position: "absolute",
    left: Platform.select({ ios: 2, android: 3 }),
    top: Platform.select({ ios: 2, android: 3 }),
    backgroundColor: "transparent",
    zIndex: 0,
  },
});

export default SplashScreen;
