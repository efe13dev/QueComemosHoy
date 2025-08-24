import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { saveRecipe } from "../data/api";
import { hardShadow, outline, theme } from "../utils/theme";

import NeoDropdown from "./ui/NeoDropdown";
import RetroButton from "./ui/RetroButton";
import RetroInput from "./ui/RetroInput";
import RetroPanel from "./ui/RetroPanel";

const AddFormRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    time: "",
    image: "",
    people: "",
    ingredients: [{ id: `${"ing-"}${Date.now()}`, text: "" }],
    preparation: [{ id: `${"prep-"}${Date.now()}`, text: "" }],
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [categoryPressed, setCategoryPressed] = useState(false);

  const handleChange = (name, value, index) => {
    if (name === "ingredients" || name === "preparation") {
      const updatedArray = [...recipe[name]];

      updatedArray[index] = { ...updatedArray[index], text: value };
      setRecipe({ ...recipe, [name]: updatedArray });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const addInput = (name) => {
    const prefix = name === "ingredients" ? "ing" : "prep";

    setRecipe({
      ...recipe,
      [name]: [...recipe[name], { id: `${prefix}-${Date.now()}`, text: "" }],
    });
  };

  const removeInput = (name, index) => {
    const updatedArray = [...recipe[name]];

    updatedArray.splice(index, 1);
    setRecipe({ ...recipe, [name]: updatedArray });
  };

  const resetForm = () => {
    setRecipe({
      name: "",
      category: "",
      time: "",
      image: "",
      people: "",
      ingredients: [{ id: `${"ing-"}${Date.now()}`, text: "" }],
      preparation: [{ id: `${"prep-"}${Date.now()}`, text: "" }],
    });
  };

  const handleSubmit = () => {
    if (recipe.image === "") {
      recipe.image =
        "https://i.pinimg.com/564x/5d/fb/70/5dfb70fe26266074c99911272330eb03.jpg";
    }

    // Convertir los ingredientes y pasos a formato simple antes de enviar
    const recipeToSave = {
      ...recipe,
      ingredients: recipe.ingredients.map((ing) => ing.text),
      preparation: recipe.preparation.map((step) => step.text),
    };

    saveRecipe(recipeToSave)
      .then(() => {
        setSuccessModalVisible(true);
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo guardar la receta");
        console.error(error);
      });
  };

  const handleSuccessConfirm = () => {
    setSuccessModalVisible(false);
    resetForm(); // Resetear el formulario después de guardar exitosamente
  };

  return (
    <View style={styles.form_container}>
      {/* Modal de confirmación de adición exitosa */}
      <Modal
        animationType="fade"
        transparent
        visible={successModalVisible}
        onRequestClose={handleSuccessConfirm}
      >
        <View style={styles.centeredView}>
          <RetroPanel style={styles.modalView}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color={theme.colors.success}
              />
            </View>
            <Text style={styles.modalTitle}>¡Receta añadida!</Text>
            <Text style={styles.modalText}>
              La receta se ha guardado correctamente
            </Text>
            <RetroButton
              variant="success"
              title="Aceptar"
              onPress={handleSuccessConfirm}
              style={styles.modalButtonCompat}
            />
          </RetroPanel>
        </View>
      </Modal>

      <RetroInput
        placeholder="Nombre de la receta"
        value={recipe.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <View
        style={[
          styles.selectWrapper,
          categoryPressed && styles.selectWrapperPressed,
        ]}
      >
        <View style={styles.dropdownContainer}>
          <NeoDropdown
            value={recipe.category}
            items={[
              { label: "Pasta & Arroces", value: "Pasta & Arroces" },
              { label: "Pescados", value: "Pescados" },
              { label: "Pollo", value: "Pollo" },
              { label: "Otras carnes", value: "Otras carnes" },
              { label: "Verduras", value: "Verduras" },
              { label: "Guisos", value: "Guisos" },
            ]}
            placeholder="Categoría..."
            modalTitle="Selecciona categoría"
            onValueChange={(value) => handleChange("category", value)}
            accentColor={theme.colors.border}
            onPressIn={() => setCategoryPressed(true)}
            onPressOut={() => setCategoryPressed(false)}
          />
        </View>
      </View>

      <RetroInput
        placeholder="Tiempo de preparación"
        value={recipe.time}
        keyboardType="numeric"
        onChangeText={(value) => handleChange("time", value)}
      />

      <RetroInput
        placeholder="Imagen..."
        value={recipe.image}
        onChangeText={(value) => handleChange("image", value)}
      />

      <RetroInput
        placeholder="Número de personas"
        value={recipe.people}
        keyboardType="numeric"
        onChangeText={(value) => handleChange("people", value)}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View key={ingredient.id} style={styles.input_row}>
          <RetroInput
            containerStyle={styles.input_flex}
            placeholder="Ingrediente"
            value={ingredient.text}
            onChangeText={(value) => handleChange("ingredients", value, index)}
          />
          <View style={styles.actionButtonWrap}>
            <View pointerEvents="none" style={styles.actionBtnShadow} />
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                index !== recipe.ingredients.length - 1
                  ? styles.removeButton
                  : styles.addButton,
                pressed && {
                  transform: [{ translateX: 1 }, { translateY: 1 }],
                },
              ]}
              onPress={() =>
                index === recipe.ingredients.length - 1
                  ? addInput("ingredients")
                  : removeInput("ingredients", index)
              }
            >
              <Icon
                name={
                  index === recipe.ingredients.length - 1 ? "add" : "remove"
                }
                size={18}
                color={theme.colors.ink}
              />
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={styles.label}>Preparación:</Text>
      {recipe.preparation.map((step, index) => (
        <View key={step.id} style={styles.input_row}>
          <RetroInput
            containerStyle={styles.input_flex}
            placeholder="Paso"
            value={step.text}
            onChangeText={(value) => handleChange("preparation", value, index)}
          />
          <View style={styles.actionButtonWrap}>
            <View pointerEvents="none" style={styles.actionBtnShadow} />
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                index !== recipe.preparation.length - 1
                  ? styles.removeButton
                  : styles.addButton,
                pressed && {
                  transform: [{ translateX: 1 }, { translateY: 1 }],
                },
              ]}
              onPress={() =>
                index === recipe.preparation.length - 1
                  ? addInput("preparation")
                  : removeInput("preparation", index)
              }
            >
              <Icon
                name={
                  index === recipe.preparation.length - 1 ? "add" : "remove"
                }
                size={18}
                color={theme.colors.ink}
              />
            </Pressable>
          </View>
        </View>
      ))}

      <RetroButton
        title="Añadir receta"
        onPress={handleSubmit}
        variant="primary"
        style={styles.addRecipeButton}
        shadowColor={theme.colors.border}
        shadowPadding="right"
        shadowOffset={{
          default: { x: 6, y: 6 },
          pressed: { x: 3, y: 3 },
        }}
        outlineSides="all"
        disabled={
          !recipe.name?.trim() ||
          !recipe.category ||
          !recipe.time?.trim() ||
          !recipe.people?.trim() ||
          !recipe.ingredients[0]?.text?.trim() ||
          !recipe.preparation[0]?.text?.trim()
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form_container: {
    gap: 20,
    alignItems: "stretch",
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  selectWrapper: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
  },
  selectWrapperPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  selectInput: {
    height: 50,
    paddingHorizontal: 14,
    color: theme.colors.textDark,
  },
  dropdownContainer: {
    height: 50,
    justifyContent: "center",
  },
  input_row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    paddingRight: 8,
  },
  input_flex: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    ...outline({ width: 3 }),
    zIndex: 1,
  },
  actionButtonWrap: {
    position: "relative",
    width: 40,
    height: 40,
    marginLeft: 8,
    flexShrink: 0,
  },
  actionBtnShadow: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    transform: [{ translateX: 2 }, { translateY: 2 }],
    zIndex: 0,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  removeButton: {
    backgroundColor: theme.colors.danger,
  },
  icon_button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.textDark,
    alignSelf: "flex-start",
    marginLeft: 5,
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: theme.colors.textDark,
    textAlign: "center",
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
  modalButtonCompat: {
    minWidth: "80%",
  },
  addRecipeButton: {
    backgroundColor: "#FF7A00",
  },
});

export default AddFormRecipe;
