import React, { useCallback } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";

import { theme, outline, hardShadow } from "../utils/theme";

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
            <View style={styles.pickerShadow} />
            <View style={styles.pickerBox}>
              <RNPickerSelect
                value={selectedRecipe}
                style={{
                  ...pickerSelectStyles,
                  viewContainer: {
                    width: "100%",
                    height: "100%",
                  },
                  inputIOS: {
                    ...pickerSelectStyles.inputIOS,
                    width: "100%",
                  },
                  inputAndroid: {
                    ...pickerSelectStyles.inputAndroid,
                    width: "100%",
                  },
                }}
                placeholder={{ label: "Selecciona una receta...", value: null }}
                onValueChange={handleValueChange}
                items={recipesName}
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug
                pickerProps={
                  Platform.OS === "android" ? { mode: "dropdown" } : {}
                }
                textInputProps={{
                  numberOfLines: 1,
                  ellipsizeMode: "tail",
                }}
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
  pickerOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "transparent",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 0,
    color: theme.colors.ink,
    backgroundColor: "transparent",
    paddingRight: 30,
    textAlign: "left",
    height: "100%",
    fontFamily: theme.fonts.medium,
  },
  inputAndroid: {
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 0,
    color: theme.colors.ink,
    backgroundColor: "transparent",
    paddingRight: 30,
    textAlign: "left",
    height: "100%",
    fontFamily: theme.fonts.medium,
  },
  iconContainer: {
    top: 8,
    right: 12,
  },
  placeholder: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "left",
    fontFamily: theme.fonts.medium,
  },
});

export default WeekDayPicker;
