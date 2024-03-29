import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
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
    ingredients: '',
    preparation: ''
  });
  const handleChange = (name, value) => {
    if (name === 'ingredients' || name === 'preparation') {
      const arrayValue = value.split(',').map((item) => item.trim());
      setRecipe({ ...recipe, [name]: arrayValue });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
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
      ingredients: '',
      preparation: ''
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.form_container}>
          <TextInput
            value={recipe.name}
            style={styles.input}
            placeholder='Nombre..'
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            onChangeText={(value) => handleChange('name', value)}
          />
          <RNPickerSelect
            value={recipe.category}
            style={styles}
            placeholder={{ label: 'Categoria...', value: null }}
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
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
          <TextInput
            value={recipe.ingredients}
            style={[styles.input, styles.height_input]}
            placeholder='Ingredientes... (separados por coma)'
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            onChangeText={(value) => handleChange('ingredients', value)}
          />
          <TextInput
            value={recipe.preparation}
            style={[styles.input, styles.height_input]}
            placeholder='Preparación... (pasos separados por coma)'
            placeholderTextColor='rgba(0, 0, 0, 0.3)'
            onChangeText={(value) => handleChange('preparation', value)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={!recipe.name.trim()}
          >
            <Text>Añadir receta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    marginTop: 15,
    flexGrow: 1
  },

  form_container: {
    gap: 40,
    alignItems: 'center'
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 16,

    width: '90%',
    height: 40
  },
  inputAndroid: {
    fontSize: 16,
    marginHorizontal: 15,

    height: 45
  },
  button: {
    marginTop: 15,
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  }
});

export default AddFormRecipe;
