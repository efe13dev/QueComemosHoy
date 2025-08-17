import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Modal de confirmación personalizado */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning-outline" size={40} color="#FF6B6B" />
            </View>
            <Text style={styles.modalTitle}>Eliminar receta</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que quieres eliminar esta receta?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonDeleteText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de eliminación exitosa */}
      <Modal
        animationType="fade"
        transparent
        visible={successModalVisible}
        onRequestClose={handleSuccessConfirm}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color="#28A745"
              />
            </View>
            <Text style={styles.modalTitle}>Receta eliminada</Text>
            <Text style={styles.modalText}>
              La receta se eliminó correctamente
            </Text>
            <Pressable
              style={[styles.modalButton, styles.buttonSuccess]}
              onPress={handleSuccessConfirm}
            >
              <Text style={styles.buttonSuccessText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de actualización exitosa */}
      <Modal
        animationType="fade"
        transparent
        visible={updateModalVisible}
        onRequestClose={handleUpdateConfirm}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color="#28A745"
              />
            </View>
            <Text style={styles.modalTitle}>Receta actualizada</Text>
            <Text style={styles.modalText}>
              La receta se actualizó correctamente
            </Text>
            <Pressable
              style={[styles.modalButton, styles.buttonUpdate]}
              onPress={handleUpdateConfirm}
            >
              <Text style={styles.buttonUpdateText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {recipe && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <View style={styles.iconStack}>
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={theme.colors.border}
                style={styles.iconShadow}
              />
              <MaterialCommunityIcons name="pencil" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={showAlert}>
            <View style={styles.iconStack}>
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={theme.colors.border}
                style={styles.iconShadow}
              />
              <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
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
          {recipe && <Text style={styles.categoryText}>{recipe.category}</Text>}
          <Text style={styles.label}>Tiempo (min)</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.time ? updatedRecipe.time.toString() : "0"}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, time: text })
            }
            keyboardType="numeric"
          />
          <Text style={styles.label}>Imagen (URL)</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.image || ""}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, image: text })
            }
          />
          <Text style={styles.label}>Personas</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.people ? updatedRecipe.people.toString() : "1"}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, people: text })
            }
            keyboardType="numeric"
          />
          <Text style={styles.label}>Ingredientes</Text>
          {updatedRecipe?.ingredients?.map((ingredient) => (
            <View key={ingredient.id} style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  { height: Math.max(50, inputHeights[ingredient.id] || 50) },
                ]}
                value={ingredient.text}
                onChangeText={(text) =>
                  handleIngredientChange(text, ingredient.id)
                }
                multiline
                textAlignVertical="top"
                onContentSizeChange={(e) =>
                  handleContentSizeChange(
                    ingredient.id,
                    e.nativeEvent.contentSize.height + 20,
                  )
                }
              />
              {ingredient.id ===
                updatedRecipe?.ingredients[updatedRecipe.ingredients.length - 1]
                  ?.id && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.addButton]}
                  onPress={() => addInput("ingredients")}
                >
                  <Icon name="add" size={18} color="#FFF" />
                </TouchableOpacity>
              )}
              {updatedRecipe?.ingredients?.length > 1 &&
                ingredient.id !==
                  updatedRecipe?.ingredients[
                    updatedRecipe.ingredients.length - 1
                  ]?.id && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => removeInput("ingredients", ingredient.id)}
                  >
                    <Icon name="remove" size={18} color="#FFF" />
                  </TouchableOpacity>
                )}
            </View>
          ))}
          <Text style={styles.label}>Preparación</Text>
          {updatedRecipe?.preparation?.map((step) => (
            <View key={step.id} style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.preparationInput,
                  { height: Math.max(50, inputHeights[step.id] || 50) },
                ]}
                value={step.text}
                onChangeText={(text) => handlePreparationChange(text, step.id)}
                multiline
                textAlignVertical="top"
                onContentSizeChange={(e) =>
                  handleContentSizeChange(
                    step.id,
                    e.nativeEvent.contentSize.height + 20,
                  )
                }
                blurOnSubmit
                onSubmitEditing={() => {}}
              />
              {step.id ===
                updatedRecipe?.preparation[updatedRecipe.preparation.length - 1]
                  ?.id && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.addButton]}
                  onPress={() => addInput("preparation")}
                >
                  <Icon name="add" size={18} color="#FFF" />
                </TouchableOpacity>
              )}
              {updatedRecipe?.preparation?.length > 1 &&
                step.id !==
                  updatedRecipe?.preparation[
                    updatedRecipe.preparation.length - 1
                  ]?.id && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => removeInput("preparation", step.id)}
                  >
                    <Icon name="remove" size={18} color="#FFF" />
                  </TouchableOpacity>
                )}
            </View>
          ))}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </>
      ) : (
        recipe && (
          <>
            <Text style={styles.title}>{recipe.name}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.metaCard, styles.metaPrimary]}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={theme.colors.ink}
                />
                <Text style={styles.metaText}>{recipe.time} min</Text>
              </View>
              <View style={[styles.metaCard, styles.metaSuccess]}>
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={18}
                  color={theme.colors.ink}
                />
                <Text style={styles.metaText}>{recipe.people} pers.</Text>
              </View>
              {!!recipe.category && (
                <View style={[styles.metaCard, styles.metaAccent]}>
                  <MaterialCommunityIcons
                    name="tag-outline"
                    size={18}
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
          <Text style={styles.titleIngredientsInstructions}>Ingredientes:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.ingredients?.map((ingredient, idx) => (
              <View key={ingredient.id} style={styles.listItemWrapper}>
                {idx % 3 === 0 && (
                  <WaveMark style={styles.itemBg} opacity={1} />
                )}
                {idx % 3 === 1 && (
                  <PinkTarget style={styles.itemBg} opacity={1} />
                )}
                {idx % 3 === 2 && (
                  <GreenDiamond style={styles.itemBg} opacity={1} />
                )}
                <View
                  style={
                    idx % 2 === 0
                      ? styles.listIngredientsInstructionsPar
                      : styles.listIngredientsInstructionsOdd
                  }
                >
                  <Text style={styles.listItemText}>· {ingredient.text}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.titleIngredientsInstructions}>Preparación:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.preparation?.map((step, idx) => (
              <View key={step.id} style={styles.listItemWrapper}>
                {idx % 3 === 0 && (
                  <WaveMark style={styles.itemBg} opacity={1} />
                )}
                {idx % 3 === 1 && (
                  <PinkTarget style={styles.itemBg} opacity={1} />
                )}
                {idx % 3 === 2 && (
                  <GreenDiamond style={styles.itemBg} opacity={1} />
                )}
                <View
                  style={
                    idx % 2 === 0
                      ? styles.listIngredientsInstructionsPar
                      : styles.listIngredientsInstructionsOdd
                  }
                >
                  <Text style={styles.listItemText}>· {step.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    overflow: "hidden",
    borderRadius: 0,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: theme.colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    marginVertical: 15,
    color: theme.colors.textDark,
    textAlign: "center",
    width: "100%",
    textShadowColor: theme.colors.border,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
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
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.textDark,
    width: "100%",
    textShadowColor: theme.colors.border,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  containerIngredientsInstructions: {
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  listItemWrapper: {
    position: "relative",
    width: "100%",
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
    marginBottom: 20,
  },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    marginHorizontal: 6,
    marginVertical: 6,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
  },
  listItemText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.regular,
    fontSize: 16,
  },
  itemBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  metaText: {
    marginLeft: 8,
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
  },
  metaPrimary: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.primary,
  },
  metaSuccess: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.success,
  },
  metaAccent: {
    borderLeftWidth: 8,
    borderLeftColor: theme.colors.accent,
  },
  iconStack: {
    position: "relative",
    width: 24,
    height: 24,
  },
  iconShadow: {
    position: "absolute",
    left: 3,
    top: 3,
  },
  updateButton: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 0,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
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
    marginBottom: 15,
    justifyContent: "space-between", // Distribuir el espacio entre el input y el botón
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
    marginBottom: 10,
    width: "100%",
    color: theme.colors.textDark,
    fontStyle: "italic",
  },
  preparationInput: {
    height: "auto",
    minHeight: 50,
    textAlignVertical: "center",
    justifyContent: "center",
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
});
