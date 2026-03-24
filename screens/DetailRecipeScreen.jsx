import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { captureRef } from "react-native-view-shot";

import CustomModal from "../components/CustomModal";
import GreenDiamond from "../components/svg/GreenDiamond";
import PinkTarget from "../components/svg/PinkTarget";
import WaveMark from "../components/svg/WaveMark";
import { deleteRecipe, getRecipe, updateRecipe } from "../data/api";
import { hardShadow, outline, theme } from "../utils/theme";

const DetailRecipe = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({});
  const [inputHeights, setInputHeights] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [sharing, setSharing] = useState(false);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);

  // Generador de ID único
  const generateUniqueId = useCallback(
    () => `id_${Math.random().toString(36).substr(2, 9)}`,
    [],
  );

  const getListRecipe = useCallback(
    async (id) => {
      const [data] = await getRecipe(id);
      // Asignar IDs únicos a ingredientes y pasos si no los tienen
      const enhancedData = {
        ...data,
        ingredients: data.ingredients.map((ingredient) =>
          typeof ingredient === "string"
            ? { id: generateUniqueId(), text: ingredient }
            : ingredient,
        ),
        preparation: data.preparation.map((step) =>
          typeof step === "string"
            ? { id: generateUniqueId(), text: step }
            : step,
        ),
      };

      setRecipe(enhancedData);
      setUpdatedRecipe(enhancedData);
    },
    [generateUniqueId],
  );

  useEffect(() => {
    getListRecipe(id);
  }, [id, getListRecipe]);

  const showAlert = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(async () => {
    setModalVisible(false);
    await deleteRecipe(id);
    setSuccessModalVisible(true);
  }, [id]);

  const handleSuccessConfirm = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.navigate("MyRecipes");
  }, [navigation]);

  const handleUpdate = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(async () => {
    // Convertir de vuelta a formato simple para guardar
    const simplifiedRecipe = {
      ...updatedRecipe,
      time: Number.parseInt(updatedRecipe.time, 10),
      people: Number.parseInt(updatedRecipe.people, 10),
      ingredients: updatedRecipe.ingredients.map((item) => item.text),
      preparation: updatedRecipe.preparation.map((item) => item.text),
    };

    await updateRecipe(id, simplifiedRecipe);
    setIsEditing(false);
    setUpdateModalVisible(true);
  }, [updatedRecipe, id]);

  const handleUpdateConfirm = useCallback(() => {
    setUpdateModalVisible(false);
    getListRecipe(id);
  }, [getListRecipe, id]);

  const handleIngredientChange = useCallback((text, ingredientId) => {
    setUpdatedRecipe((prev) => {
      const newIngredients = prev.ingredients.map((item) =>
        item.id === ingredientId ? { ...item, text } : item,
      );

      return { ...prev, ingredients: newIngredients };
    });
  }, []);

  const handlePreparationChange = useCallback((text, stepId) => {
    setUpdatedRecipe((prev) => {
      const newPreparation = prev.preparation.map((item) =>
        item.id === stepId ? { ...item, text } : item,
      );

      return { ...prev, preparation: newPreparation };
    });
  }, []);

  const addInput = useCallback(
    (field) => {
      const newItem = { id: generateUniqueId(), text: "" };

      setUpdatedRecipe((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), newItem],
      }));
    },
    [generateUniqueId],
  );

  const removeInput = useCallback((field, itemId) => {
    setUpdatedRecipe((prev) => {
      const updatedArray = prev[field].filter((item) => item.id !== itemId);

      return {
        ...prev,
        [field]: updatedArray,
      };
    });
  }, []);

  // Función para manejar el cambio de altura del input
  const handleContentSizeChange = (id, height) => {
    setInputHeights((prev) => ({
      ...prev,
      [id]: height,
    }));
  };

  const handleShare = useCallback(async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "Compartir no disponible",
          "La función de compartir no está disponible en este dispositivo.",
        );

        return;
      }

      setSharing(true);
      const uri = await captureRef(contentRef.current, {
        format: "png",
        quality: 1,
        result: "tmpfile",
        backgroundColor: "#FFFFFF",
      });

      await Sharing.shareAsync(uri, {
        dialogTitle: `Compartir receta: ${recipe?.name ?? "Receta"}`,
        mimeType: "image/png",
      });
    } catch (e) {
      console.error("Error al compartir receta (imagen)", e);

      // Fallback: compartir como texto si la imagen falla
      try {
        const text = [
          `🍽️ ${recipe?.name ?? "Receta"}`,
          recipe?.time ? `⏱️ Tiempo: ${recipe.time} min` : null,
          recipe?.people ? `👥 Personas: ${recipe.people}` : null,
          recipe?.category ? `🏷️ Categoría: ${recipe.category}` : null,
          "",
          "Ingredientes:",
          ...(recipe?.ingredients ?? []).map((i) => `· ${i.text ?? i}`),
          "",
          "Preparación:",
          ...(recipe?.preparation ?? []).map(
            (s, idx) => `${idx + 1}. ${s.text ?? s}`,
          ),
        ]
          .filter(Boolean)
          .join("\n");

        await Share.share({
          title: `Receta: ${recipe?.name ?? "Receta"}`,
          message: text,
        });
      } catch (e2) {
        console.error("Error al compartir receta (texto)", e2);
        Alert.alert(
          "Error",
          "No se pudo compartir la receta. Inténtalo de nuevo.",
        );
      }
    } finally {
      setSharing(false);
    }
  }, [recipe]);

  const renderDecoratedItem = (item, idx, content) => {
    const variant = idx % 3;
    const isEven = idx % 2 === 0;

    let background = null;

    if (variant === 0) {
      background = (
        <WaveMark
          style={[styles.readItemBg, styles.readBgWave]}
          opacity={0.35}
          color={theme.colors.primary}
          strokeWidth={14}
        />
      );
    } else if (variant === 1) {
      background = (
        <PinkTarget
          style={[styles.readItemBg, styles.readBgTarget]}
          opacity={0.4}
          outer={theme.colors.secondary}
          inner="#F5ECFF"
          stroke={theme.colors.border}
          strokeWidth={8}
        />
      );
    } else {
      background = (
        <GreenDiamond
          style={[styles.readItemBg, styles.readBgDiamond]}
          opacity={0.35}
          fill={theme.colors.success}
          stroke={theme.colors.border}
          strokeWidth={8}
        />
      );
    }

    return (
      <View
        key={item.id ?? `${content}-${idx}`}
        style={[
          styles.listItemWrapper,
          isEven ? styles.readItemWrapper : styles.readItemWrapperAlt,
        ]}
      >
        <View style={styles.readItemBackground}>{background}</View>
        <View style={styles.readItemContentWrapper}>
          <View
            style={[
              styles.readItemCard,
              isEven ? styles.readItemCardPrimary : styles.readItemCardAlt,
            ]}
          >
            <Text style={styles.listItemText}>{content}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEditableInputRow = ({
    item,
    idx,
    isLast,
    canRemove,
    onAddPress,
    onRemovePress,
    inputStyle,
    inputProps = {},
  }) => {
    const variant = idx % 3;

    let background = null;

    if (variant === 0) {
      background = (
        <WaveMark
          style={[styles.editItemBg, styles.editBgWave]}
          opacity={0.2}
          color={theme.colors.primary}
          strokeWidth={12}
        />
      );
    } else if (variant === 1) {
      background = (
        <PinkTarget
          style={[styles.editItemBg, styles.editBgTarget]}
          opacity={0.24}
          outer={theme.colors.secondary}
          inner="#F5ECFF"
          stroke={theme.colors.border}
          strokeWidth={5}
        />
      );
    } else {
      background = (
        <GreenDiamond
          style={[styles.editItemBg, styles.editBgDiamond]}
          opacity={0.2}
          fill={theme.colors.success}
          stroke={theme.colors.border}
          strokeWidth={5}
        />
      );
    }

    const composedInputStyle = [
      styles.input,
      styles.inputInsideRow,
      ...(Array.isArray(inputStyle) ? inputStyle : [inputStyle]),
    ].filter(Boolean);

    return (
      <View key={item.id ?? `edit-${idx}`} style={styles.editItemWrapper}>
        <View style={styles.editItemBackground}>{background}</View>
        <View style={styles.editItemContentWrapper}>
          <View style={styles.inputRow}>
            <TextInput {...inputProps} style={composedInputStyle} />
            <View style={styles.inputActions}>
              {isLast && onAddPress ? (
                <Pressable
                  style={[styles.actionButton, styles.addButton]}
                  onPress={onAddPress}
                >
                  <Icon name="add" size={18} color="#FFF" />
                </Pressable>
              ) : null}
              {canRemove && onRemovePress ? (
                <Pressable
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={onRemovePress}
                >
                  <Icon name="remove" size={18} color="#FFF" />
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenRoot}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        collapsable={false}
        removeClippedSubviews={false}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Eliminar receta"
          message="¿Estás seguro de que quieres eliminar esta receta?"
          icon="warning-outline"
          iconColor={theme.colors.danger}
          buttons={[
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setModalVisible(false),
            },
            { text: "Eliminar", onPress: handleDelete },
          ]}
        />

        <CustomModal
          visible={successModalVisible}
          onClose={handleSuccessConfirm}
          title="Receta eliminada"
          message="La receta se eliminó correctamente"
          icon="checkmark-circle-outline"
          iconColor={theme.colors.success}
          buttons={[{ text: "Aceptar", onPress: handleSuccessConfirm }]}
        />

        <CustomModal
          visible={updateModalVisible}
          onClose={handleUpdateConfirm}
          title="Receta actualizada"
          message="La receta se actualizó correctamente"
          icon="checkmark-circle-outline"
          iconColor={theme.colors.success}
          buttons={[{ text: "Aceptar", onPress: handleUpdateConfirm }]}
        />
        <View ref={contentRef} collapsable={false}>
          {recipe && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: recipe.image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.4)"]}
                style={styles.imageOverlay}
              />
              <View style={styles.imageDivider} />
              {!sharing && (
                <Pressable style={styles.updateButton} onPress={handleUpdate}>
                  <View style={styles.iconStack}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={28}
                      color={theme.colors.border}
                      style={styles.iconShadow}
                    />
                    <MaterialCommunityIcons
                      name="pencil"
                      size={28}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>
              )}
              {!sharing && (
                <Pressable style={styles.button} onPress={showAlert}>
                  <View style={styles.iconStack}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={28}
                      color={theme.colors.border}
                      style={styles.iconShadow}
                    />
                    <MaterialCommunityIcons
                      name="delete"
                      size={28}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>
              )}
              {!isEditing && !sharing && (
                <Pressable
                  style={styles.shareButton}
                  onPress={handleShare}
                  disabled={sharing}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconStack}>
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={28}
                      color={theme.colors.border}
                      style={styles.iconShadow}
                    />
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={28}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>
              )}
            </View>
          )}
          {isEditing && updatedRecipe ? (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={updatedRecipe.name || ""}
                onChangeText={(text) =>
                  setUpdatedRecipe({ ...updatedRecipe, name: text })
                }
              />
              <Text style={styles.label}>Categoría</Text>
              {recipe && (
                <Text style={styles.categoryText}>{recipe.category}</Text>
              )}
              <Text style={styles.label}>Tiempo (min)</Text>
              <TextInput
                style={styles.input}
                value={updatedRecipe.time ? updatedRecipe.time.toString() : "0"}
                onChangeText={(text) =>
                  setUpdatedRecipe({
                    ...updatedRecipe,
                    time: Number.parseInt(text, 10) || 0,
                  })
                }
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={styles.label}>Imagen (URL)</Text>
              <TextInput
                style={[styles.input, styles.imageUrlInput]}
                value={updatedRecipe.image || ""}
                onChangeText={(text) =>
                  setUpdatedRecipe({ ...updatedRecipe, image: text.trim() })
                }
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="url"
                textContentType="URL"
                selectTextOnFocus
                multiline
                numberOfLines={3}
                scrollEnabled={false}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <Text style={styles.label}>Personas</Text>
              <TextInput
                style={styles.input}
                value={
                  updatedRecipe.people ? updatedRecipe.people.toString() : "1"
                }
                onChangeText={(text) =>
                  setUpdatedRecipe({
                    ...updatedRecipe,
                    people: Number.parseInt(text, 10) || 1,
                  })
                }
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={styles.label}>Ingredientes</Text>
              {updatedRecipe?.ingredients?.map((ingredient, idx) =>
                renderEditableInputRow({
                  item: ingredient,
                  idx,
                  isLast:
                    ingredient.id ===
                    updatedRecipe?.ingredients[
                      updatedRecipe.ingredients.length - 1
                    ]?.id,
                  canRemove:
                    (updatedRecipe?.ingredients?.length ?? 0) > 1 &&
                    ingredient.id !==
                      updatedRecipe?.ingredients[
                        updatedRecipe.ingredients.length - 1
                      ]?.id,
                  onAddPress: () => addInput("ingredients"),
                  onRemovePress: () =>
                    removeInput("ingredients", ingredient.id),
                  inputProps: {
                    value: ingredient.text,
                    onChangeText: (text) =>
                      handleIngredientChange(text, ingredient.id),
                    multiline: true,
                    textAlignVertical: "top",
                    onContentSizeChange: (e) =>
                      handleContentSizeChange(
                        ingredient.id,
                        e.nativeEvent.contentSize.height + 20,
                      ),
                  },
                  inputStyle: {
                    height: Math.max(50, inputHeights[ingredient.id] || 50),
                  },
                }),
              )}
              <Text style={styles.label}>Preparación</Text>
              {updatedRecipe?.preparation?.map((step, idx) =>
                renderEditableInputRow({
                  item: step,
                  idx,
                  isLast:
                    step.id ===
                    updatedRecipe?.preparation[
                      updatedRecipe.preparation.length - 1
                    ]?.id,
                  canRemove:
                    (updatedRecipe?.preparation?.length ?? 0) > 1 &&
                    step.id !==
                      updatedRecipe?.preparation[
                        updatedRecipe.preparation.length - 1
                      ]?.id,
                  onAddPress: () => addInput("preparation"),
                  onRemovePress: () => removeInput("preparation", step.id),
                  inputProps: {
                    value: step.text,
                    onChangeText: (text) =>
                      handlePreparationChange(text, step.id),
                    multiline: true,
                    textAlignVertical: "top",
                    onContentSizeChange: (e) =>
                      handleContentSizeChange(
                        step.id,
                        e.nativeEvent.contentSize.height + 20,
                      ),
                    blurOnSubmit: true,
                    onSubmitEditing: () => {},
                  },
                  inputStyle: [
                    styles.preparationInput,
                    { height: Math.max(50, inputHeights[step.id] || 50) },
                  ],
                }),
              )}
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar</Text>
              </Pressable>
            </>
          ) : (
            recipe && (
              <>
                <Text style={styles.title}>{recipe.name}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.metaCard, styles.metaPrimary]}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={theme.colors.ink}
                    />
                    <Text style={styles.metaText}>{recipe.time} min</Text>
                  </View>
                  <View style={[styles.metaCard, styles.metaSuccess]}>
                    <MaterialCommunityIcons
                      name="account-group-outline"
                      size={20}
                      color={theme.colors.ink}
                    />
                    <Text style={styles.metaText}>{recipe.people} pers.</Text>
                  </View>
                  {!!recipe.category && (
                    <View style={[styles.metaCard, styles.metaAccent]}>
                      <MaterialCommunityIcons
                        name="tag-outline"
                        size={20}
                        color={theme.colors.ink}
                      />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {recipe.category}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )
          )}
          {recipe && (
            <>
              <Text style={styles.titleIngredientsInstructions}>
                Ingredientes:
              </Text>
              <View style={styles.containerIngredientsInstructions}>
                {recipe.ingredients?.map((ingredient, idx) =>
                  renderDecoratedItem(ingredient, idx, `· ${ingredient.text}`),
                )}
              </View>
              <View style={styles.sectionDivider} />
              <Text style={styles.titleIngredientsInstructions}>
                Preparación:
              </Text>
              <View style={styles.containerIngredientsInstructions}>
                {recipe.preparation?.map((step, idx) =>
                  renderDecoratedItem(step, idx, `${idx + 1}. ${step.text}`),
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 320,
    overflow: "hidden",
    borderRadius: 0,
    marginBottom: 25,
    backgroundColor: theme.colors.surface,
    ...outline({ width: 4 }),
    ...hardShadow({ x: 5, y: 5, elevation: 10 }),
    borderWidth: 4,
    borderColor: theme.colors.border,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: theme.colors.danger,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 4 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  shareButton: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: theme.colors.secondary,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 4 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  imageDivider: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 34,
    fontFamily: theme.fonts.extrabold,
    marginVertical: 20,
    color: theme.colors.textDark,
    textAlign: "center",
    width: "100%",
    textShadowColor: theme.colors.border,
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    letterSpacing: 1.2,
  },
  textTime: {
    color: theme.colors.textDark,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  spanTime: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
  },
  titleIngredientsInstructions: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    marginTop: 25,
    marginBottom: 12,
    color: "#FFFFFF",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.secondary,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
    textAlign: "left",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  containerIngredientsInstructions: {
    paddingHorizontal: 10,
    marginBottom: 25,
    width: "100%",
  },
  sectionDivider: {
    width: "100%",
    height: 4,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
  },
  listItemWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 12,
  },
  listIngredientsInstructionsPar: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    marginBottom: 8,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 8,
    borderTopColor: theme.colors.border,
    borderRightColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
    borderLeftColor: theme.colors.border,
  },
  listIngredientsInstructionsOdd: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 0,
    marginBottom: 8,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 8,
    borderTopColor: theme.colors.border,
    borderRightColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
    borderLeftColor: theme.colors.border,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 0,
    marginHorizontal: 8,
    marginVertical: 8,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 7 }),
  },
  listItemText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.regular,
    fontSize: 17,
    lineHeight: 24,
    position: "relative",
    zIndex: 1,
  },
  readItemWrapper: {
    position: "relative",
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  readItemWrapperAlt: {
    position: "relative",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  readItemBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  readItemBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  readItemContentWrapper: {
    position: "relative",
    zIndex: 1,
  },
  readBgWave: {
    transform: [
      { translateX: -20 },
      { translateY: -35 },
      { scale: 1.05 },
      { rotate: "-12deg" },
    ],
  },
  readBgTarget: {
    transform: [{ translateX: 30 }, { translateY: -40 }, { scale: 0.85 }],
  },
  readBgDiamond: {
    transform: [
      { translateX: -25 },
      { translateY: -30 },
      { scale: 1.0 },
      { rotate: "-15deg" },
    ],
  },
  readItemCard: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderLeftWidth: 12,
    borderLeftColor: theme.colors.border,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 5, y: 5, elevation: 8 }),
  },
  readItemCardPrimary: {
    backgroundColor: theme.colors.surface,
  },
  readItemCardAlt: {
    backgroundColor: "#F8F8F8",
  },
  editItemWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 14,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  editItemBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  editItemBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  editItemContentWrapper: {
    position: "relative",
    zIndex: 1,
  },
  editBgWave: {
    transform: [
      { translateX: -8 },
      { translateY: -10 },
      { scale: 1.05 },
      { rotate: "-6deg" },
    ],
  },
  editBgTarget: {
    transform: [{ translateX: 24 }, { translateY: -18 }, { scale: 0.8 }],
  },
  editBgDiamond: {
    transform: [
      { translateX: -20 },
      { translateY: -12 },
      { scale: 0.95 },
      { rotate: "-15deg" },
    ],
  },
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 8,
  },
  metaText: {
    marginLeft: 8,
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },
  metaPrimary: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.primary,
    backgroundColor: "#FFF9E6",
  },
  metaSuccess: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.success,
    backgroundColor: "#EAFAF1",
  },
  metaAccent: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.accent,
    backgroundColor: "#FFF0F0",
  },
  iconStack: {
    position: "relative",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  iconShadow: {
    position: "absolute",
    left: 3,
    top: 3,
  },
  updateButton: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: theme.colors.primary,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 4 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  input: {
    minHeight: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "85%",
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textDark,
    borderRadius: 0,
    alignSelf: "flex-start",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 0,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
    width: "100%",
    color: theme.colors.textDark,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 0,
    justifyContent: "space-between",
  },
  inputInsideRow: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 0,
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.border,
  },
  singleLineInput: {
    minHeight: 44,
    height: 48,
    paddingVertical: 8,
    textAlignVertical: "center",
  },
  imageUrlInput: {
    width: "100%",
    minHeight: 60,
    paddingVertical: 12,
    textAlignVertical: "top",
    lineHeight: 20,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    alignSelf: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  removeButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 16,
    width: "100%",
    color: theme.colors.textDark,
    fontStyle: "italic",
  },
  preparationInput: {
    height: "auto",
    minHeight: 50,
    textAlignVertical: "top",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 10,
  },
  // Estilos para el modal personalizado
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    padding: 25,
    alignItems: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginBottom: 15,
    color: theme.colors.textDark,
    textAlign: "center",
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  iconContainer: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.textDark,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 0,
    padding: 12,
    minWidth: "45%",
    alignItems: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  buttonCancel: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  buttonCancelText: {
    color: theme.colors.textMuted,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonDelete: {
    backgroundColor: theme.colors.danger,
  },
  buttonDeleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonSuccess: {
    backgroundColor: theme.colors.success,
    minWidth: "80%",
  },
  buttonSuccessText: {
    color: theme.colors.ink,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonUpdate: {
    backgroundColor: theme.colors.primary,
    minWidth: "80%",
  },
  buttonUpdateText: {
    color: theme.colors.ink,
    fontWeight: "bold",
    fontSize: 16,
  },
  fabShare: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: theme.colors.accent,
    width: 56,
    height: 56,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
});
