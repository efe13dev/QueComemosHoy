import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

import {
  actualizarRecetaDelDia,
  getRecipes,
  obtenerMenuSemanalSinInicializar,
} from "../data/api";
import { theme, outline, hardShadow } from "../utils/theme";

import CustomModal from "./CustomModal";
import WeekDayPicker from "./WeekDayPicker";

export function GenerateMenu() {
  const [recipesName, setRecipesName] = useState([]);
  const [weekMenu, setweekMenu] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetPressed, setResetPressed] = useState(false);

  const handleError = useCallback((error, message) => {
    // eslint-disable-next-line no-console
    console.error(error);
    setErrorMessage(message);
    setErrorModalVisible(true);
  }, []);

  const getListRecipesName = useCallback(async () => {
    try {
      const data = await getRecipes();
      const dataName = data.map((item) => item.name);
      const recipeList = dataName
        .map((item) => ({
          label: item.trim(),
          value: item.trim(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      setRecipesName(recipeList);
    } catch (error) {
      handleError(error, "No se pudieron cargar las recetas");
    }
  }, [handleError]); // Añadir handleError como dependencia

  const loadMenuFromSupabase = useCallback(async () => {
    try {
      // Usamos la nueva función que solo obtiene datos sin inicializar
      const { data: menu, error } = await obtenerMenuSemanalSinInicializar();

      if (error) throw error;

      const menuObject = {};

      for (const item of menu) {
        const newValue = item.menu_data?.trim() || "";

        if (menuObject[item.id] !== newValue) {
          menuObject[item.id] = newValue;
        }
      }

      setweekMenu(menuObject);
    } catch (error) {
      handleError(error, "No se pudo cargar el menú");
    } finally {
      setIsLoading(false);
    }
  }, [handleError]); // Añadir handleError como dependencia

  useEffect(() => {
    if (isLoading) {
      getListRecipesName();
      loadMenuFromSupabase();
    }
  }, [isLoading, getListRecipesName, loadMenuFromSupabase]);

  const handleChange = useCallback(
    async (day, value) => {
      try {
        if (weekMenu[day] === value) {
          return;
        }

        const previousValue = weekMenu[day];

        setweekMenu((prev) => ({
          ...prev,
          [day]: value,
        }));

        const valueToSend = value || "";
        const { error } = await actualizarRecetaDelDia(day, valueToSend);

        if (error) {
          console.error(`Error al actualizar ${day}:`, error);
          setweekMenu((prev) => ({
            ...prev,
            [day]: previousValue,
          }));
          throw error;
        }
      } catch (error) {
        handleError(error, "No se pudo actualizar el menú");
      }
    },
    [weekMenu, handleError],
  ); // Añadir weekMenu y handleError como dependencias

  const resetMenu = useCallback(async () => {
    try {
      setIsResetting(true);

      const diasSemana = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
      ];

      for (const dia of diasSemana) {
        const { error } = await actualizarRecetaDelDia(dia, " ");

        if (error) {
          console.error(`Error al resetear ${dia}:`, error);
          throw error;
        }
      }

      const updatedWeekMenu = {};

      for (const dia of diasSemana) {
        updatedWeekMenu[dia] = "";
      }

      setweekMenu(updatedWeekMenu);
      setResetModalVisible(false);
      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 300);
    } catch (error) {
      handleError(error, "No se pudo reiniciar el menú");
    } finally {
      setIsResetting(false);
    }
  }, [handleError]); // Añadir handleError como dependencia

  const confirmResetMenu = useCallback(() => {
    // Mostramos el modal de confirmación en lugar del Alert
    setResetModalVisible(true);
  }, []); // Ya no depende de resetMenu porque no lo llama directamente

  const handleConfirmReset = useCallback(() => {
    resetMenu();
  }, [resetMenu]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Usamos la función sin inicializar para el refresco también
    Promise.all([getListRecipesName(), loadMenuFromSupabase()]).finally(() => {
      setRefreshing(false);
    });
  }, [getListRecipesName, loadMenuFromSupabase]); // Depende de las funciones que llama

  const daysOfWeek = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={styles.titleShadow}>Menú Semanal</Text>
          <Text style={styles.titleShadow2}>Menú Semanal</Text>
          <Text style={styles.titleShadow3}>Menú Semanal</Text>
          <Text style={styles.titleShadow4}>Menú Semanal</Text>
          <Animatable.Text
            animation="fadeInDown"
            duration={500}
            useNativeDriver
            style={styles.title}
          >
            Menú Semanal
          </Animatable.Text>
        </View>
        <Animatable.View
          animation="fadeInUp"
          delay={80}
          duration={500}
          useNativeDriver
          style={styles.menuContainer}
        >
          {daysOfWeek.map((day) => (
            <WeekDayPicker
              key={day}
              day={day}
              handleChange={handleChange}
              recipesName={recipesName}
              selectedRecipe={weekMenu[day]}
            />
          ))}
        </Animatable.View>
        <View style={styles.resetWrap}>
          <View
            style={[
              styles.resetShadow,
              resetPressed && styles.resetShadowPressed,
            ]}
          />
          <TouchableOpacity
            style={[
              styles.resetButton,
              resetPressed && styles.resetButtonPressed,
              isResetting && styles.resetButtonDisabled,
            ]}
            onPress={confirmResetMenu}
            onPressIn={() => setResetPressed(true)}
            onPressOut={() => setResetPressed(false)}
            disabled={isResetting}
            activeOpacity={0.9}
          >
            <Text style={styles.resetButtonText}>
              {isResetting ? "Eliminando..." : "Eliminar Menú"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmación para resetear el menú */}
      <CustomModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        title="Confirmación"
        message="¿Estás seguro de que deseas eliminar el menú semanal?"
        icon="alert-circle"
        iconColor="#c63636"
        buttons={[
          {
            text: "Cancelar",
            onPress: () => setResetModalVisible(false),
            style: "cancel",
            disabled: isResetting,
          },
          {
            text: "Eliminar",
            loadingText: "Eliminando...",
            loading: isResetting,
            onPress: () => {
              handleConfirmReset();
            },
          },
        ]}
      />

      {/* Modal de éxito después de resetear el menú */}
      <CustomModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Menú Eliminado"
        message="El menú semanal ha sido reiniciado exitosamente."
        icon="checkmark-circle"
        iconColor={theme.colors.primary}
      />

      {/* Modal de error */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message={errorMessage}
        icon="alert-circle"
        iconColor={theme.colors.danger}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  container: {
    flex: 1,
  },
  titleWrap: {
    position: "relative",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    color: theme.colors.textDark,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 1,
  },
  titleShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: 2 }, { translateY: 2 }],
    zIndex: 0,
  },
  titleShadow2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: -2 }, { translateY: 0 }],
    zIndex: 0,
  },
  titleShadow3: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: 0 }, { translateY: -2 }],
    zIndex: 0,
  },
  titleShadow4: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    zIndex: 0,
  },
  menuContainer: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    padding: theme.spacing.md,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  resetWrap: {
    position: "relative",
    width: "100%",
    marginTop: theme.spacing.xl,
  },
  resetShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.border, // sombra negra
    transform: [{ translateX: 6 }, { translateY: 6 }], // abajo-derecha
    zIndex: 0,
  },
  resetShadowPressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  resetButton: {
    backgroundColor: theme.colors.danger, // rojo neobrutalista para acción destructiva
    borderRadius: 0,
    padding: theme.spacing.md,
    alignItems: "center",
    ...outline({ width: 3 }),
    zIndex: 1,
  },
  resetButtonPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  resetButtonDisabled: {
    backgroundColor: theme.colors.border,
    borderColor: theme.colors.borderDark,
    opacity: 0.7,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    zIndex: 1,
  },
});
