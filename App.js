import "react-native-gesture-handler";

import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  useFonts as useSoraFonts,
} from "@expo-google-fonts/sora";
import { useFonts as useLocalFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

import Navigation from "./Navigation";

export default function App() {
  const [soraLoaded] = useSoraFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  const [marioLoaded] = useLocalFonts({
    NewSuperMarioFontU: require("./assets/fonts/New Super Mario Font U.ttf"),
  });

  if (!soraLoaded || !marioLoaded) return null;

  // Aplicar fuente por defecto a todos los <Text/>
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    Text.defaultProps.style,
    { fontFamily: "Sora_400Regular" },
  ];

  return <Navigation />;
}
