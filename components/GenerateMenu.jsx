import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Svg, { G, Path, Polygon } from "react-native-svg";

import {
  actualizarRecetaDelDia,
  getRecipes,
  obtenerMenuSemanalSinInicializar,
} from "../data/api";
import { hardShadow, outline, theme } from "../utils/theme";

import CustomModal from "./CustomModal";
import WeekDayPicker from "./WeekDayPicker";

// Animated wrapper para elementos SVG (debe ir después de todos los imports)
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

// SVG decorativo proporcionado (como componente reutilizable)
const DecorSvg1 = ({
  size = 100,
  color = "#000000",
  rotation = 0,
  opacity = 1,
  style,
  flowerFill = "#000000",
  flowerScaleValue = 1,
}) => (
  <Svg width={size} height={size} viewBox="0 0 128 128" style={style}>
    <G transform={`rotate(${rotation} 64 64)`}>
      <AnimatedG
        originX={64}
        originY={22}
        style={{ transform: [{ scale: flowerScaleValue }] }}
      >
        <Path
          d="M64.2,22.4l0.2-0.1l4.2-2.1l-2.8,4c0,0-3.7,5.1,1.7,7c0,0,0.1,0,0.1,0l0,0c5.5,1.9,5.5-4.6,5.5-4.6l0.2-4.8l2,4.3l0,0.1 c0,0,1.2,2.7,3.4,3.2c1,0.2,2.2,0,3.5-1.2c4.4-3.8-1.2-7.1-1.2-7.1l-0.1,0L77,18.5l4.5,0.4l0.3,0.1c0,0,4.8,0.5,5.3-3.1 c0.1-0.5,0-1.1-0.1-1.8c-1.1-5.8-6.7-2.5-6.7-2.5l-0.2,0.1L76,13.7l2.8-4c0,0,3.7-5.1-1.7-7c0,0-0.1,0-0.1,0c0,0,0,0,0,0 c-5.5-1.9-5.5,4.5-5.5,4.5l-0.3,4.9l-2-4.3l-0.1-0.1c0,0-1.4-3.2-4-3.3c-0.9,0-1.8,0.3-2.9,1.3c-4.4,3.8,1.2,7.1,1.2,7.1l0.1,0 l4.1,2.6L63,15l-0.3-0.1c0,0-4.8-0.5-5.3,3.1c-0.1,0.5,0,1.1,0.1,1.8C58.6,25.6,64.2,22.4,64.2,22.4z"
          fill={flowerFill}
          stroke={color}
          strokeWidth={0.2}
          strokeOpacity={opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </AnimatedG>
      <Path
        d="M105.5,91.2h-30l21.3-26.5c0.9-1.1,0.9-2.7,0-3.6c-1.1-0.9-2.5-0.8-3.5,0.1l-14.1,17V60.3c0-1.1-0.9-1.9-2-1.9 c-1.1,0-1.9,0.8-1.9,1.9v18.4l-21,26.8l-13.8,10.7V108V97.9V79l28-28c1.2-1.2,1.3-3.4,0-4.7c-1.2-1.2-3.4-1.1-4.6,0.1L50.2,60 l-1.5-16.9l13.9-13.9c-0.5-1.5-0.2-3,0.3-4.2c-0.9,0.2-1.9,0.4-3,0.2l-12,12L44.2,3.5c0-1.5-1.2-2.5-2.5-2.5 c-1.5,0-2.4,1.2-2.4,2.5l2.1,22L28.8,12.9c-0.8-0.8-2-0.7-2.8,0c-0.8,0.8-0.7,1.9,0,2.7l13,13l3.9,33.8L30.5,74.7 c0,0-2.1,2.3-2.1,5c0,1.3,0,12.2,0,23.5c0,6,0,12.2,0,16.9c0,2,0,3.4,0,4.4h14l11.7-9.1h26.1c1.7,0,3.4-1.5,3.4-3.4 c0-1.7-1.6-3.2-3.4-3.2H61l11-13h33.7c1.3,0,2.3-1.1,2.3-2.4C107.9,92.2,106.8,91.2,105.5,91.2z"
        fill="#000000"
        stroke={color}
        strokeWidth={0.2}
        strokeOpacity={opacity}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </G>
  </Svg>
);

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
      <Polygon
        points="80,10 100,60 150,60 110,90 125,140 80,110 35,140 50,90 10,60 60,60"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {overlayOpacity ? (
        <AnimatedPolygon
          points="80,10 100,60 150,60 110,90 125,140 80,110 35,140 50,90 10,60 60,60"
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
  const [flowerColor, setFlowerColor] = useState("#000000");
  const starColor = "#4D4DFF";
  const flowerScale = useRef(new Animated.Value(1)).current;
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

  // Paleta neobrutalista de la app para colores aleatorios de la flor
  const brutalistPalette = useMemo(
    () => [
      theme.colors.primary,
      theme.colors.accent,
      theme.colors.success,
      theme.colors.danger,
      theme.colors.secondary,
    ],
    [],
  );

  // Constantes de animación (ajustables en un solo lugar)
  const STAR_DURATION = 1600; // ms
  const STAR_RED_ON_PCT = 0.2; // 20%
  const STAR_RED_OFF_PCT = 0.45; // 45%

  // Rotación de la estrella: no lineal + scale sutil (4 vueltas)
  const starSpinAnimation = useMemo(
    () => ({
      0: { transform: [{ rotate: "0deg" }, { scale: 1 }] },
      0.25: { transform: [{ rotate: "360deg" }, { scale: 1.08 }] },
      0.5: { transform: [{ rotate: "720deg" }, { scale: 1.11 }] },
      0.75: { transform: [{ rotate: "1080deg" }, { scale: 1.08 }] },
      1: { transform: [{ rotate: "1440deg" }, { scale: 1 }] },
    }),
    [],
  );

  // Color inicial aleatorio para la flor (evitar negro al inicio)
  const initOnceRef = useRef(false);

  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;

    const start =
      brutalistPalette[Math.floor(Math.random() * brutalistPalette.length)];

    setFlowerColor(start);
  }, [brutalistPalette]);

  // Vibración con desplazamiento bajo (solo planta) — el scale va en la flor
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

  const handlePlantPress = useCallback(() => {
    // Elegimos un nuevo color aleatorio distinto al actual
    const options = brutalistPalette.filter((c) => c !== flowerColor);
    const next =
      options[Math.floor(Math.random() * options.length)] || flowerColor;

    // Aplicamos directamente el nuevo color
    setFlowerColor(next);

    // Pop sutil en la flor
    Animated.sequence([
      Animated.timing(flowerScale, {
        toValue: 1.03,
        duration: 120,
        useNativeDriver: false,
      }),
      Animated.timing(flowerScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();

    // Vibración izquierda-derecha con poca amplitud al pulsar la planta
    plantRef.current?.animate?.(plantShakeAnimation, 450);
  }, [brutalistPalette, flowerColor, plantShakeAnimation]);

  const handleStarPress = useCallback(() => {
    // Lanzamos la animación de giro
    const res = starRef.current?.animate?.(
      starSpinAnimation,
      STAR_DURATION,
      "ease-in-out",
    );

    // Animar overlay rojo con fade in/out entre los porcentajes definidos
    const duration = STAR_DURATION;
    const tOn = Math.floor(duration * STAR_RED_ON_PCT);
    const tOff = Math.floor(duration * STAR_RED_OFF_PCT);

    Animated.parallel([
      Animated.sequence([
        Animated.delay(tOn),
        Animated.timing(starOverlayOpacity, {
          toValue: 1,
          duration: 140,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.delay(tOff),
        Animated.timing(starOverlayOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Aseguramos opacidad en 0 al terminar
    if (res && typeof res.then === "function") {
      res.then(() => starOverlayOpacity.setValue(0));
    } else {
      setTimeout(() => starOverlayOpacity.setValue(0), duration);
    }
  }, [starSpinAnimation, starOverlayOpacity]);

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
                <DecorSvg1
                  size={d.size}
                  color="#000000"
                  rotation={d.rotate}
                  opacity={d.opacity}
                  flowerFill={flowerColor}
                  flowerScaleValue={flowerScale}
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
                <TouchableOpacity
                  key={`hit_${d.key}`}
                  activeOpacity={1}
                  onPress={handlePlantPress}
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
          <TouchableOpacity
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
          <View style={{ zIndex: 1 }}>
            {DAYS_OF_WEEK.map((day) => (
              <WeekDayPicker
                key={day}
                day={day}
                handleChange={handleDraftChange}
                recipesName={recipesName}
                selectedRecipe={draftMenu[day]}
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
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>

          <View style={styles.trashWrap}>
            <View
              style={[
                styles.trashShadow,
                resetPressed && styles.trashShadowPressed,
                isResetting && styles.trashShadowDisabled,
              ]}
            />
            <TouchableOpacity
              style={[
                styles.trashButton,
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
                size={32}
                color={isResetting ? theme.colors.textMuted : theme.colors.ink}
                style={styles.trashIcon}
              />
            </TouchableOpacity>
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
  saveButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    fontWeight: "normal",
    color: theme.colors.ink,
    textAlign: "center",
  },
  saveButtonTextDisabled: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: theme.fonts.bold,
    fontWeight: "normal",
    textAlign: "center",
  },
  saveButtonTextHighlight: {
    fontSize: 16,
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
