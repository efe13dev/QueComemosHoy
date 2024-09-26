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
              style={styles.icon_button}
              onPress={() => addInput('ingredients')}
            >
              <Icon
                name='add-circle'
                size={30}
                color='#28a745'
              />
            </TouchableOpacity>
          )}
          {recipe.ingredients.length > 1 && (
            <TouchableOpacity
              style={styles.icon_button}
              onPress={() => removeInput('ingredients', index)}
            >
              <Icon
                name='remove-circle'
                size={30}
                color='#dc3545'
              />
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
              style={styles.icon_button}
              onPress={() => addInput('preparation')}
            >
              <Icon
                name='add-circle'
                size={30}
                color='#28a745'
              />
            </TouchableOpacity>
          )}
          {recipe.preparation.length > 1 && (
            <TouchableOpacity
              style={styles.icon_button}
              onPress={() => removeInput('preparation', index)}
            >
              <Icon
                name='remove-circle'
                size={30}
                color='#dc3545'
              />
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
