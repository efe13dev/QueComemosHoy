import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Svg, { Circle, G, Path, Polygon } from "react-native-svg";

import {
  actualizarRecetaDelDia,
  getRecipes,
  obtenerMenuSemanalSinInicializar,
} from "../data/api";
import { useResponsive } from "../hooks/useResponsive";
import { getSeason } from "../utils/season";
import { hardShadow, outline, theme } from "../utils/theme";

import CustomModal from "./CustomModal";
import NeoTitle from "./ui/NeoTitle";
import SeasonalTree from "./ui/SeasonalTree";
import WeekDayPicker from "./WeekDayPicker";

// Animated wrapper para elementos SVG (debe ir después de todos los imports)
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

const DAYS_OF_WEEK = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const DecorStar = ({
  size = 160,
  fill = "#4D4DFF",
  stroke = "#000000",
  strokeWidth = 6,
  rotation = 0,
  style,
  overlayOpacity,
  overlayColor,
}) => (
  <Svg width={size} height={size} viewBox="0 0 160 160" style={style}>
    <G transform={`rotate(${rotation} 80 80)`}>
      <G transform="translate(6 6)" opacity="0.2">
        <Polygon
          points="80,8 96,42 132,28 118,64 152,80 118,96 132,132 96,118 80,152 64,118 28,132 42,96 8,80 42,64 28,28 64,42"
          fill="#000000"
          stroke="none"
        />
      </G>
      <Polygon
        points="80,8 96,42 132,28 118,64 152,80 118,96 132,132 96,118 80,152 64,118 28,132 42,96 8,80 42,64 28,28 64,42"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Polygon
        points="80,28 91,51 116,44 108,69 132,80 108,91 116,116 91,109 80,132 69,109 44,116 52,91 28,80 52,69 44,44 69,51"
        fill="#FFF4CC"
        stroke={stroke}
        strokeWidth="4"
      />
      <Circle
        cx="80"
        cy="80"
        r="20"
        fill="#FFFFFF"
        stroke={stroke}
        strokeWidth="4"
      />
      <Path
        d="M80 62 L84 76 L98 80 L84 84 L80 98 L76 84 L62 80 L76 76 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <Circle
        cx="49"
        cy="47"
        r="6"
        fill="#FFFFFF"
        stroke={stroke}
        strokeWidth="3"
      />
      <Circle
        cx="113"
        cy="113"
        r="5"
        fill="#FFD84D"
        stroke={stroke}
        strokeWidth="3"
      />
      {overlayOpacity ? (
        <AnimatedPolygon
          points="80,8 96,42 132,28 118,64 152,80 118,96 132,132 96,118 80,152 64,118 28,132 42,96 8,80 42,64 28,28 64,42"
          fill={overlayColor}
          opacity={overlayOpacity}
          stroke="none"
          pointerEvents="none"
        />
      ) : null}
    </G>
  </Svg>
);

export function GenerateMenu() {
  const { isNarrow } = useResponsive();
  const [recipesName, setRecipesName] = useState([]);
  const [weekMenu, setweekMenu] = useState({});
  const [draftMenu, setDraftMenu] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [saveSuccessModalVisible, setSaveSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resetPressed, setResetPressed] = useState(false);
  const [savePressed, setSavePressed] = useState(false);
  const [season, setSeason] = useState(getSeason());
  const starColor = "#4D4DFF";
  const treeScale = useRef(new Animated.Value(1)).current;
  const starOverlayOpacity = useRef(new Animated.Value(0)).current;

  const { width: screenW } = Dimensions.get("window");
  const decorations = useMemo(() => {
    // Anclado y visible; lo subimos y desplazamos a la izquierda
    const size = Math.min(screenW * 0.18, 180);

    return [
      {
        key: "dec1",
        size,
        rotate: -3,
        left: -10,
        top: -15,
        opacity: 1,
      },
    ];
  }, [screenW]);

  // Constantes de animación (ajustables en un solo lugar)
  const STAR_DURATION = 720; // ms

  // Animación tipo spark badge: golpe, twist y rebote corto
  const starPunchAnimation = useMemo(
    () => ({
      0: {
        transform: [{ rotate: "0deg" }, { scale: 1 }, { translateY: 0 }],
      },
      0.12: {
        transform: [{ rotate: "-10deg" }, { scale: 0.9 }, { translateY: 4 }],
      },
      0.28: {
        transform: [{ rotate: "14deg" }, { scale: 1.14 }, { translateY: -6 }],
      },
      0.48: {
        transform: [{ rotate: "-8deg" }, { scale: 0.98 }, { translateY: 1 }],
      },
      0.68: {
        transform: [{ rotate: "6deg" }, { scale: 1.06 }, { translateY: -2 }],
      },
      1: {
        transform: [{ rotate: "0deg" }, { scale: 1 }, { translateY: 0 }],
      },
    }),
    [],
  );

  // Color inicial aleatorio para la flor (evitar negro al inicio)
  const initOnceRef = useRef(false);

  // Inicializar estación actual (se actualiza al montar)
  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;
    setSeason(getSeason());
  }, []);

  // Vibración con desplazamiento bajo — el scale va en el árbol
  const plantShakeAnimation = useMemo(
    () => ({
      0: { transform: [{ translateX: 0 }] },
      0.2: { transform: [{ translateX: -3 }] },
      0.4: { transform: [{ translateX: 3 }] },
      0.6: { transform: [{ translateX: -2 }] },
      0.8: { transform: [{ translateX: 2 }] },
      1: { transform: [{ translateX: 0 }] },
    }),
    [],
  );

  const handleTreePress = useCallback(() => {
    const seasons = ["spring", "summer", "autumn", "winter"];

    setSeason((prev) => {
      const currentIndex = seasons.indexOf(prev);
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % seasons.length;

      return seasons[nextIndex];
    });

    // Pop sutil en el árbol
    Animated.sequence([
      Animated.timing(treeScale, {
        toValue: 1.03,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(treeScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();

    // Vibración izquierda-derecha con poca amplitud al pulsar el árbol
    plantRef.current?.animate?.(plantShakeAnimation, 450);
  }, [plantShakeAnimation, treeScale]);

  const handleStarPress = useCallback(() => {
    // Lanzamos la animación de golpe + twist
    const res = starRef.current?.animate?.(
      starPunchAnimation,
      STAR_DURATION,
      "ease-out-back",
    );

    // Doble destello rápido acorde al nuevo badge
    starOverlayOpacity.setValue(0);
    Animated.sequence([
      Animated.delay(40),
      Animated.timing(starOverlayOpacity, {
        toValue: 0.95,
        duration: 70,
        useNativeDriver: false,
      }),
      Animated.timing(starOverlayOpacity, {
        toValue: 0.18,
        duration: 90,
        useNativeDriver: false,
      }),
      Animated.timing(starOverlayOpacity, {
        toValue: 0.85,
        duration: 60,
        useNativeDriver: false,
      }),
      Animated.timing(starOverlayOpacity, {
        toValue: 0,
        duration: 130,
        useNativeDriver: false,
      }),
    ]).start();

    // Aseguramos opacidad en 0 al terminar
    if (res && typeof res.then === "function") {
      res.then(() => starOverlayOpacity.setValue(0));
    } else {
      setTimeout(() => starOverlayOpacity.setValue(0), STAR_DURATION);
    }
  }, [starOverlayOpacity, starPunchAnimation]);

  // No necesitamos timers; overlay usa Animated

  const starDecoration = useMemo(() => {
    const size = Math.min(screenW * 0.2, 160);

    return {
      size,
      rotate: 15,
      right: -10,
      top: -15,
      stroke: "#000000",
      strokeWidth: 6,
    };
  }, [screenW]);

  // Refs para animar las decoraciones al pulsar
  const plantRef = useRef(null);
  const starRef = useRef(null);

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
      setDraftMenu({ ...menuObject });
      setSaveSuccessModalVisible(false);
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

  const handleDraftChange = useCallback((day, value) => {
    setDraftMenu((prev) => ({
      ...prev,
      [day]: value,
    }));
    setSaveSuccessModalVisible(false);
  }, []);

  const hasPendingChanges = useMemo(() => {
    for (const day of DAYS_OF_WEEK) {
      const draftValue = draftMenu[day] ?? "";
      const savedValue = weekMenu[day] ?? "";

      if (draftValue !== savedValue) {
        return true;
      }
    }

    return false;
  }, [draftMenu, weekMenu]);

  const handleSaveMenu = useCallback(async () => {
    if (!hasPendingChanges || isSaving) return;

    try {
      setIsSaving(true);

      for (const day of DAYS_OF_WEEK) {
        const draftValue = draftMenu[day] ?? "";
        const savedValue = weekMenu[day] ?? "";

        if (draftValue === savedValue) {
          continue;
        }

        const valueToSend = draftValue || "";
        const { error } = await actualizarRecetaDelDia(day, valueToSend);

        if (error) {
          throw error;
        }
      }

      setweekMenu({ ...draftMenu });
      setSaveSuccessModalVisible(true);
    } catch (error) {
      handleError(error, "No se pudo guardar el menú");
    } finally {
      setIsSaving(false);
      setSavePressed(false);
    }
  }, [draftMenu, weekMenu, hasPendingChanges, isSaving, handleError]);

  const resetMenu = useCallback(async () => {
    try {
      setIsResetting(true);

      for (const dia of DAYS_OF_WEEK) {
        const { error } = await actualizarRecetaDelDia(dia, " ");

        if (error) {
          console.error(`Error al resetear ${dia}:`, error);
          throw error;
        }
      }

      const updatedWeekMenu = {};

      for (const dia of DAYS_OF_WEEK) {
        updatedWeekMenu[dia] = "";
      }

      setweekMenu(updatedWeekMenu);
      setDraftMenu({ ...updatedWeekMenu });
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
        <NeoTitle
          text="Menú Semanal"
          fontSize={theme.fontSize.xl}
          shadowColor={theme.colors.primary}
          animated
          marginBottom={theme.spacing.md}
        />
        {/* Decoraciones SVG: visibles por debajo (no capturan toques) */}
        <View pointerEvents="none" style={[styles.decorationsWrap]}>
          {decorations.map((d) => {
            return (
              <Animatable.View
                key={d.key}
                ref={(el) => {
                  if (d.key === "dec1") {
                    plantRef.current = el;
                  }
                }}
                style={{
                  position: "absolute",
                  left: d.left ?? 0,
                  top: d.top ?? 0,
                }}
              >
                <SeasonalTree
                  size={d.size}
                  season={season}
                  rotation={d.rotate}
                  flowerScaleValue={treeScale}
                />
              </Animatable.View>
            );
          })}
          <Animatable.View
            ref={starRef}
            style={{
              position: "absolute",
              right: starDecoration.right,
              top: starDecoration.top,
            }}
          >
            <DecorStar
              size={starDecoration.size}
              fill={starColor}
              stroke={starDecoration.stroke}
              strokeWidth={starDecoration.strokeWidth}
              rotation={starDecoration.rotate}
              overlayOpacity={starOverlayOpacity}
              overlayColor={theme.colors.danger}
            />
          </Animatable.View>
        </View>
        {/* Capa de hitboxes invisible por encima para disparar animaciones */}
        <View pointerEvents="box-none" style={styles.decorationsHitboxWrap}>
          {decorations.map((d) => {
            if (d.key === "dec1") {
              return (
                <Pressable
                  key={`hit_${d.key}`}
                  activeOpacity={1}
                  onPress={handleTreePress}
                  style={{
                    position: "absolute",
                    left: d.left ?? 0,
                    top: d.top ?? 0,
                    width: d.size,
                    height: d.size,
                  }}
                />
              );
            }

            return null;
          })}
          <Pressable
            activeOpacity={1}
            onPress={handleStarPress}
            style={{
              position: "absolute",
              right: starDecoration.right,
              top: starDecoration.top,
              width: starDecoration.size,
              height: starDecoration.size,
            }}
          />
        </View>
        <Animatable.View
          animation="fadeInUp"
          delay={80}
          duration={500}
          useNativeDriver
          style={[
            styles.menuContainer,
            {
              position: "relative",
            },
          ]}
        >
          <View style={styles.menuHeaderBar} />
          <View style={{ zIndex: 1 }}>
            {DAYS_OF_WEEK.map((day) => (
              <WeekDayPicker
                key={day}
                day={day}
                handleChange={handleDraftChange}
                recipesName={recipesName}
                selectedRecipe={draftMenu[day]}
                isLoading={isLoading}
              />
            ))}
          </View>
        </Animatable.View>

        <View style={styles.actionsRow}>
          <View style={styles.saveWrap}>
            <View
              style={[
                styles.saveShadow,
                (savePressed || isSaving) && styles.saveShadowPressed,
                (!hasPendingChanges || isSaving) && styles.saveShadowDisabled,
              ]}
            />
            <Pressable
              style={[
                styles.saveButton,
                (savePressed || isSaving) && styles.saveButtonPressed,
                (!hasPendingChanges || isSaving) && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveMenu}
              onPressIn={() => setSavePressed(true)}
              onPressOut={() => setSavePressed(false)}
              disabled={!hasPendingChanges || isSaving}
              activeOpacity={0.9}
            >
              <View style={styles.saveButtonContent}>
                <MaterialCommunityIcons
                  name={isSaving ? "progress-clock" : "content-save"}
                  size={20}
                  color={
                    !hasPendingChanges || isSaving
                      ? "#9CA3AF"
                      : theme.colors.ink
                  }
                  style={styles.saveButtonIcon}
                />
                <Text
                  style={[
                    styles.saveButtonText,
                    (!hasPendingChanges || isSaving) &&
                      styles.saveButtonTextDisabled,
                    hasPendingChanges &&
                      !isSaving &&
                      styles.saveButtonTextHighlight,
                  ]}
                >
                  {isSaving ? "Guardando..." : "Guardar Menú"}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={[styles.trashWrap, isNarrow && styles.trashWrapNarrow]}>
            <View
              style={[
                styles.trashShadow,
                resetPressed && styles.trashShadowPressed,
                isResetting && styles.trashShadowDisabled,
              ]}
            />
            <Pressable
              style={[
                styles.trashButton,
                isNarrow && styles.trashButtonNarrow,
                resetPressed && styles.trashButtonPressed,
                isResetting && styles.trashButtonDisabled,
              ]}
              onPress={confirmResetMenu}
              onPressIn={() => setResetPressed(true)}
              onPressOut={() => setResetPressed(false)}
              disabled={isResetting}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name={isResetting ? "progress-clock" : "trash-can-outline"}
                size={isNarrow ? 26 : 32}
                color={isResetting ? theme.colors.textMuted : theme.colors.ink}
                style={styles.trashIcon}
              />
            </Pressable>
          </View>
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

      <CustomModal
        visible={saveSuccessModalVisible}
        onClose={() => setSaveSuccessModalVisible(false)}
        title="Menú Guardado"
        message="Los cambios se han guardado exitosamente."
        icon="checkmark-circle"
        iconColor={theme.colors.success}
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
    position: "relative",
  },
  menuHeaderBar: {
    height: 6,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    marginHorizontal: -theme.spacing.md,
    marginTop: -theme.spacing.md,
  },
  menuContainer: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    padding: theme.spacing.md,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    zIndex: 1,
  },
  decorationsWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  decorationsHitboxWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: "transparent",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  saveWrap: {
    flex: 1,
    position: "relative",
  },
  saveShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    transform: [{ translateX: 6 }, { translateY: 6 }],
    zIndex: 0,
  },
  saveShadowPressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  saveShadowDisabled: {
    opacity: 0.25,
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 0,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    zIndex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: "#FFE8A3",
    ...outline({ width: 3, color: "#8C8C8C" }),
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fonts.bold,
    fontWeight: "normal",
    color: theme.colors.ink,
    textAlign: "center",
  },
  saveButtonTextDisabled: {
    fontSize: theme.fontSize.base,
    color: "#9CA3AF",
    fontFamily: theme.fonts.bold,
    fontWeight: "normal",
    textAlign: "center",
  },
  saveButtonTextHighlight: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fonts.bold,
    fontWeight: "normal",
    color: theme.colors.ink,
    textAlign: "center",
  },
  trashWrap: {
    height: 52,
    position: "relative",
  },
  trashShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    transform: [{ translateX: 6 }, { translateY: 6 }],
    zIndex: 0,
  },
  trashShadowPressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  trashShadowDisabled: {
    opacity: 0.35,
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  trashButton: {
    width: 60,
    height: 52,
    backgroundColor: theme.colors.danger,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    zIndex: 1,
  },
  trashButtonPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
  },
  trashButtonDisabled: {
    backgroundColor: theme.colors.border,
    ...outline({ width: 3, color: theme.colors.border }),
  },
  trashIcon: {
    textAlign: "center",
    color: theme.colors.ink,
  },
});
