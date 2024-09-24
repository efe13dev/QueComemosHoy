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

const AddFormRecipe = () => {
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    time: '',
    image: '',
    people: '',
    ingredients: [''],
    preparation: ['']
  });

  const handleChange = (name, value, index) => {
    if (name === 'ingredients' || name === 'preparation') {
      const updatedArray = [...recipe[name]];
      updatedArray[index] = value;
      setRecipe({ ...recipe, [name]: updatedArray });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const addInput = (name) => {
    setRecipe({ ...recipe, [name]: [...recipe[name], ''] });
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
    saveRecipe(recipe);
    setRecipe({
      name: '',
      category: '',
      time: '',
      image: '',
      people: '',
      ingredients: [''],
      preparation: ['']
    });

    showAlert();
  };

  const showAlert = () => {
    Alert.alert(
      'Receta añadida',
      'Se ha añadido una nueva receta a tu lista',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            navigation.navigate('MyRecipesScreen');
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.form_container}>
      <TextInput
        value={recipe.name}
        style={styles.input}
        placeholder='Nombre..'
        placeholderTextColor='rgba(0, 0, 0, 0.3)'
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
        value={recipe.time}
        style={styles.input}
        placeholder='Tiempo... (min)'
        placeholderTextColor='rgba(0, 0, 0, 0.3)'
        keyboardType='numeric'
        onChangeText={(value) => handleChange('time', value)}
      />
      <TextInput
        value={recipe.image}
        style={styles.input}
        placeholder='Imagen...'
        placeholderTextColor='rgba(0, 0, 0, 0.3)'
        onChangeText={(value) => handleChange('image', value)}
      />
      <TextInput
        value={recipe.people}
        style={styles.input}
        placeholder='Personas...'
        placeholderTextColor='rgba(0, 0, 0, 0.3)'
        keyboardType='numeric'
        onChangeText={(value) => handleChange('people', value)}
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View
          key={index}
          style={styles.input_row}
        >
          <TextInput
            value={ingredient}
            style={[styles.input, styles.input_flex]}
            placeholder={`Ingrediente ${index + 1}`}
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            onChangeText={(value) => handleChange('ingredients', value, index)}
          />
          {index === recipe.ingredients.length - 1 && (
            <TouchableOpacity
              style={styles.add_button}
              onPress={() => addInput('ingredients')}
            >
              <Text style={styles.add_button_text}>+</Text>
            </TouchableOpacity>
          )}
          {recipe.ingredients.length > 1 && (
            <TouchableOpacity
              style={styles.remove_button}
              onPress={() => removeInput('ingredients', index)}
            >
              <Text style={styles.remove_button_text}>-</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Text style={styles.label}>Preparación:</Text>
      {recipe.preparation.map((step, index) => (
        <View
          key={index}
          style={styles.input_row}
        >
          <TextInput
            value={step}
            style={[styles.input, styles.input_flex]}
            placeholder={`Paso ${index + 1}`}
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            onChangeText={(value) => handleChange('preparation', value, index)}
          />
          {index === recipe.preparation.length - 1 && (
            <TouchableOpacity
              style={styles.add_button}
              onPress={() => addInput('preparation')}
            >
              <Text style={styles.add_button_text}>+</Text>
            </TouchableOpacity>
          )}
          {recipe.preparation.length > 1 && (
            <TouchableOpacity
              style={styles.remove_button}
              onPress={() => removeInput('preparation', index)}
            >
              <Text style={styles.remove_button_text}>-</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.button_container,
          {
            backgroundColor:
              !recipe.name.trim() ||
              !recipe.category ||
              !(recipe.time && recipe.time.trim()) ||
              !(recipe.people && recipe.people.trim()) ||
              !recipe.ingredients[0].trim() ||
              !recipe.preparation[0].trim()
                ? '#cccccc' // Color gris cuando está deshabilitado
                : '#007BFF' // Color azul cuando está habilitado
          }
        ]}
        onPress={handleSubmit}
        disabled={
          !recipe.name.trim() ||
          !recipe.category ||
          !(recipe.time && recipe.time.trim()) ||
          !(recipe.people && recipe.people.trim()) ||
          !recipe.ingredients[0].trim() ||
          !recipe.preparation[0].trim()
        }
      >
        <Text style={styles.button_text}>Añadir receta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    marginTop: 15,
    flexGrow: 1,
    backgroundColor: '#f8f9fa' // Fondo claro para todo el contenedor
  },
  form_container: {
    gap: 20, // Espaciado más pequeño entre los elementos
    alignItems: 'center',
    paddingHorizontal: 20 // Añadir padding horizontal
  },
  input: {
    borderRadius: 8, // Bordes más redondeados
    paddingHorizontal: 15, // Más padding horizontal
    fontSize: 16,
    backgroundColor: '#ffffff', // Fondo blanco
    width: '100%', // Ancho completo
    height: 50, // Altura mayor
    marginBottom: 10, // Espaciado inferior
    borderColor: '#ced4da', // Color del borde
    borderWidth: 1 // Ancho del borde
  },
  inputAndroid: {
    borderRadius: 8, // Bordes más redondeados
    paddingHorizontal: 15, // Más padding horizontal
    fontSize: 16,
    backgroundColor: '#ffffff', // Fondo blanco
    width: '100%', // Ancho completo
    height: 50, // Altura mayor
    marginBottom: 10, // Espaciado inferior
    borderColor: '#ced4da', // Color del borde
    borderWidth: 1 // Ancho del borde
  },
  input_row: {
    flexDirection: 'row',
    alignItems: 'stretch', // Asegura que los elementos estén centrados verticalmente
    width: '100%',
    marginBottom: 10 // Añadir un margen inferior para separar las filas
  },
  input_flex: {
    flex: 1
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
  button: {
    backgroundColor: '#7AA2E3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  add_button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 50, // Bordes redondeados
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    height: 50,
    width: 50, // Ancho igual a la altura para hacer un botón circular
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  add_button_text: {
    color: '#fff',
    fontSize: 24, // Tamaño de fuente mayor
    fontWeight: 'bold'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  remove_button: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 50, // Bordes redondeados
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    height: 50,
    width: 50, // Ancho igual a la altura para hacer un botón circular
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  remove_button_text: {
    color: '#fff',
    fontSize: 24, // Tamaño de fuente mayor
    fontWeight: 'bold'
  }
});

export default AddFormRecipe;
