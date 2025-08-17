import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { hardShadow, outline, theme } from "../utils/theme";

import NeoDropdown from "./ui/NeoDropdown";

const WeekDayPicker = ({ day, handleChange, recipesName, selectedRecipe }) => {
  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

  // Paleta neobrutalista por día (vibrante y con alto contraste)
  const dayPalette = {
    lunes: theme.colors.primary, // amarillo
    martes: theme.colors.secondary, // violeta
    miercoles: theme.colors.success, // verde
    jueves: theme.colors.accent, // rojo
    viernes: "#06B6D4", // cian
    sabado: "#F472B6", // rosa
    domingo: "#FB923C", // naranja
  };

  const dayBackgroundColor = dayPalette[day] || theme.colors.surfaceAlt;

  const [pickerPressed, setPickerPressed] = useState(false);

  const handleValueChange = useCallback(
    (value) => handleChange(day, value),
    [day, handleChange],
  );

  // Sin animación: dejar comportamiento nativo del picker

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInUp"
        duration={450}
        useNativeDriver
        style={styles.rowContainer}
      >
        <View
          style={[styles.dayContainer, { backgroundColor: dayBackgroundColor }]}
        >
          <Text style={styles.dayText}>{capitalizedDay}</Text>
        </View>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrap}>
            <View
              style={[
                styles.pickerShadow,
                pickerPressed && styles.pickerShadowPressed,
              ]}
            />
            <View
              style={[
                styles.pickerBox,
                pickerPressed && styles.pickerBoxPressed,
              ]}
            >
              <NeoDropdown
                value={selectedRecipe}
                items={recipesName}
                placeholder="Selecciona una receta..."
                onValueChange={handleValueChange}
                accentColor={dayBackgroundColor}
                onPressIn={() => setPickerPressed(true)}
                onPressOut={() => setPickerPressed(false)}
              />
            </View>
          </View>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    height: 60,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  dayContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 95,
    marginRight: 6,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 6 }),
  },
  dayText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    textAlign: "center",
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  pickerContainer: {
    flex: 1,
    height: "100%",

    justifyContent: "flex-start",
  },
  pickerWrap: {
    position: "relative",
    width: "100%",
    height: "100%",
    paddingRight: 6,
    paddingBottom: 6,
  },
  pickerShadow: {
    position: "absolute",
    left: 6,
    top: 6,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    pointerEvents: "none",
    zIndex: 0,
  },
  pickerBox: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    ...outline({ width: 3 }),
    justifyContent: "center",
    zIndex: 1,
  },
  pickerBoxPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  pickerShadowPressed: {
    left: 3,
    top: 3,
  },
});

export default WeekDayPicker;
