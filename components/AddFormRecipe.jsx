import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/MaterialIcons";

import { saveRecipe } from "../data/api";

const AddFormRecipe = () => {
  const navigation = useNavigation();
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
    <ScrollView contentContainerStyle={styles.form_container}>
      {/* Modal de confirmación de adición exitosa */}
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
            <Text style={styles.modalTitle}>¡Receta añadida!</Text>
            <Text style={styles.modalText}>
              La receta se ha guardado correctamente
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

      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        value={recipe.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <RNPickerSelect
        value={recipe.category}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.inputAndroid,
          placeholder: { color: "rgba(0, 0, 0, 0.3)" },
        }}
        placeholder={{ label: "Categoria...", value: null }}
        onValueChange={(value) => handleChange("category", value)}
        items={[
          { label: "Pasta & Arroces", value: "Pasta & Arroces" },
          { label: "Pescados", value: "Pescados" },
          { label: "Pollo", value: "Pollo" },
          { label: "Otras carnes", value: "Otras carnes" },
          { label: "Verduras", value: "Verduras" },
          { label: "Guisos", value: "Guisos" },
        ]}
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo de preparación"
        value={recipe.time}
        keyboardType="numeric"
        onChangeText={(value) => handleChange("time", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Imagen..."
        value={recipe.image}
        onChangeText={(value) => handleChange("image", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de personas"
        value={recipe.people}
        keyboardType="numeric"
        onChangeText={(value) => handleChange("people", value)}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View key={ingredient.id} style={styles.input_row}>
          <TextInput
            style={[styles.input, styles.input_flex]}
            placeholder="Ingrediente"
            value={ingredient.text}
            onChangeText={(value) => handleChange("ingredients", value, index)}
          />
          <TouchableOpacity
            style={[
              styles.actionButton,
              index !== recipe.ingredients.length - 1
                ? styles.removeButton
                : styles.addButton,
            ]}
            onPress={() =>
              index === recipe.ingredients.length - 1
                ? addInput("ingredients")
                : removeInput("ingredients", index)
            }
          >
            <Icon
              name={index === recipe.ingredients.length - 1 ? "add" : "remove"}
              size={18}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Preparación:</Text>
      {recipe.preparation.map((step, index) => (
        <View key={step.id} style={styles.input_row}>
          <TextInput
            style={[styles.input, styles.input_flex]}
            placeholder="Paso"
            value={step.text}
            onChangeText={(value) => handleChange("preparation", value, index)}
          />
          <TouchableOpacity
            style={[
              styles.actionButton,
              index !== recipe.preparation.length - 1
                ? styles.removeButton
                : styles.addButton,
            ]}
            onPress={() =>
              index === recipe.preparation.length - 1
                ? addInput("preparation")
                : removeInput("preparation", index)
            }
          >
            <Icon
              name={index === recipe.preparation.length - 1 ? "add" : "remove"}
              size={18}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.button_container,
          {
            backgroundColor:
              !recipe.name?.trim() ||
              !recipe.category ||
              !recipe.time?.trim() ||
              !recipe.people?.trim() ||
              !recipe.ingredients[0]?.text?.trim() ||
              !recipe.preparation[0]?.text?.trim()
                ? "#cccccc"
                : "#FFE4B5",
          },
        ]}
        onPress={handleSubmit}
        disabled={
          !recipe.name?.trim() ||
          !recipe.category ||
          !recipe.time?.trim() ||
          !recipe.people?.trim() ||
          !recipe.ingredients[0]?.text?.trim() ||
          !recipe.preparation[0]?.text?.trim()
        }
      >
        <Text style={styles.button_text}>Añadir receta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form_container: {
    gap: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFF5E6",
  },
  input: {
    height: 50,
    borderColor: "#FFE4B5",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  inputAndroid: {
    height: 50,
    borderColor: "#FFE4B5",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input_row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  input_flex: {
    flex: 1,
    marginRight: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#8B4513",
  },
  removeButton: {
    backgroundColor: "#c63636",
  },
  button_container: {
    backgroundColor: "#FFE4B5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#D2B48C",
  },
  button_text: {
    color: "#663300",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    color: "#663300",
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
    backgroundColor: "#FFF5E6",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#FFE4B5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#663300",
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
    color: "#663300",
    lineHeight: 22,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: "80%",
    alignItems: "center",
  },
  buttonSuccess: {
    backgroundColor: "#A0522D",
  },
  buttonSuccessText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddFormRecipe;
