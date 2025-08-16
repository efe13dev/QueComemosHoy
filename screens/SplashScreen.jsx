import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
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

// Componente para cada letra animada
const AnimatedLetter = ({ letter, index, totalLetters }) => {
  return (
    <Animatable.Text
      style={styles.letter}
      animation={{
        from: { opacity: 0 },
        to: { opacity: 1 },
      }}
      duration={150}
      delay={index * 40}
      useNativeDriver
    >
      {letter}
    </Animatable.Text>
  );
};

const SplashScreen = () => {
  const [letters, setLetters] = useState([]);

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
      >
        {letters.map((letterObj) => (
          <AnimatedLetter
            key={letterObj.id}
            letter={letterObj.value}
            index={letters.indexOf(letterObj)}
            totalLetters={letters.length}
          />
        ))}
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
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.95,
    paddingHorizontal: 5,
  },
  letter: {
    fontSize: 34,
    color: theme.colors.primary,
    fontFamily: theme.fonts.extrabold,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});

export default SplashScreen;
