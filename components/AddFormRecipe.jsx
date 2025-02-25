import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { saveRecipe } from '../data/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddFormRecipe = () => {
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    time: '',
    image: '',
    people: '',
    ingredients: [{ id: `${'ing-'}${Date.now()}`, text: '' }],
    preparation: [{ id: `${'prep-'}${Date.now()}`, text: '' }]
  });

  const handleChange = (name, value, index) => {
    if (name === 'ingredients' || name === 'preparation') {
      const updatedArray = [...recipe[name]];
      updatedArray[index] = { ...updatedArray[index], text: value };
      setRecipe({ ...recipe, [name]: updatedArray });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const addInput = (name) => {
    const prefix = name === 'ingredients' ? 'ing' : 'prep';
    setRecipe({
      ...recipe,
      [name]: [...recipe[name], { id: `${prefix}-${Date.now()}`, text: '' }]
    });
  };

  const removeInput = (name, index) => {
    const updatedArray = [...recipe[name]];
    updatedArray.splice(index, 1);
    setRecipe({ ...recipe, [name]: updatedArray });
  };

  const handleSubmit = () => {
    if (recipe.image === '') {
      recipe.image =
        'https://i.pinimg.com/564x/5d/fb/70/5dfb70fe26266074c99911272330eb03.jpg';
    }

    // Convertir los ingredientes y pasos a formato simple antes de enviar
    const recipeToSave = {
      ...recipe,
      ingredients: recipe.ingredients.map(ing => ing.text),
      preparation: recipe.preparation.map(step => step.text)
    };

    saveRecipe(recipeToSave)
      .then(() => {
        Alert.alert('Éxito', 'Receta guardada correctamente');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo guardar la receta');
        console.error(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.form_container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        value={recipe.name}
        onChangeText={(value) => handleChange('name', value)}
      />

      <RNPickerSelect
        value={recipe.category}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.inputAndroid,
          placeholder: { color: 'rgba(0, 0, 0, 0.3)' }
        }}
        placeholder={{ label: 'Categoria...', value: null }}
        onValueChange={(value) => handleChange('category', value)}
        items={[
          { label: 'Pasta & Arroces', value: 'Pasta & Arroces' },
          { label: 'Pescados', value: 'Pescados' },
          { label: 'Pollo', value: 'Pollo' },
          { label: 'Otras carnes', value: 'Otras carnes' },
          { label: 'Verduras', value: 'Verduras' },
          { label: 'Guisos', value: 'Guisos' }
        ]}
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo de preparación"
        value={recipe.time}
        keyboardType="numeric"
        onChangeText={(value) => handleChange('time', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Imagen..."
        value={recipe.image}
        onChangeText={(value) => handleChange('image', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de personas"
        value={recipe.people}
        keyboardType="numeric"
        onChangeText={(value) => handleChange('people', value)}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View
          key={ingredient.id}
          style={styles.input_row}
        >
          <TextInput
            style={styles.input}
            placeholder="Ingrediente"
            value={ingredient.text}
            onChangeText={(value) => handleChange('ingredients', value, index)}
          />
          {index === recipe.ingredients.length - 1 ? (
            <TouchableOpacity onPress={() => addInput('ingredients')}>
              <Icon name="add-circle" size={24} color="#007BFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => removeInput('ingredients', index)}>
              <Icon name="remove-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Text style={styles.label}>Preparación:</Text>
      {recipe.preparation.map((step, index) => (
        <View
          key={step.id}
          style={styles.input_row}
        >
          <TextInput
            style={styles.input}
            placeholder="Paso"
            value={step.text}
            onChangeText={(value) => handleChange('preparation', value, index)}
          />
          {index === recipe.preparation.length - 1 ? (
            <TouchableOpacity onPress={() => addInput('preparation')}>
              <Icon name="add-circle" size={24} color="#007BFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => removeInput('preparation', index)}>
              <Icon name="remove-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
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
                ? '#cccccc'
                : '#007BFF'
          }
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
    alignItems: 'center',
    paddingHorizontal: 20
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%',
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  inputAndroid: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%',
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  input_row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  input_flex: {
    flex: 1,
    marginRight: 10
  },
  height_input: {
    height: 100 // Altura mayor para inputs de texto largo
  },
  button_container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF', // Color de fondo azul
    borderRadius: 8, // Bordes redondeados
    paddingVertical: 15, // Espaciado vertical mayor
    paddingHorizontal: 30, // Espaciado horizontal mayor
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Menor opacidad de la sombra
    shadowRadius: 4, // Radio de sombra mayor
    elevation: 5
  },
  button_text: {
    color: '#fff', // Texto blanco
    fontSize: 18, // Tamaño de fuente mayor
    fontWeight: 'bold', // Texto en negrita
    textAlign: 'center' // Asegura que el texto esté centrado horizontalmente
  },

  icon_button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

export default AddFormRecipe;
