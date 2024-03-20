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
import Constants from 'expo-constants';
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
        <Text style={styles.text_title}>Añade una receta</Text>
        <View style={styles.form_container}>
          <TextInput
            value={recipe.name}
            style={styles.input}
            placeholder='Nombre'
            onChangeText={(value) => handleChange('name', value)}
          />
          <RNPickerSelect
            value={recipe.category}
            style={styles}
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
            useNativeAndroidPickerStyle={false}
          />

          <TextInput
            value={recipe.time}
            style={styles.input}
            placeholder='Tiempo... (min)'
            keyboardType='numeric'
            onChangeText={(value) => handleChange('time', value)}
          />
          <TextInput
            value={recipe.image}
            style={styles.input}
            placeholder='Imagen'
            onChangeText={(value) => handleChange('image', value)}
          />
          <TextInput
            value={recipe.people}
            style={styles.input}
            placeholder='Personas'
            keyboardType='numeric'
            onChangeText={(value) => handleChange('people', value)}
          />
          <TextInput
            value={recipe.ingredients}
            style={[styles.input, styles.height_input]}
            placeholder='Ingredientes... (separados por coma)'
            onChangeText={(value) => handleChange('ingredients', value)}
          />
          <TextInput
            value={recipe.preparation}
            style={[styles.input, styles.height_input]}
            placeholder='Preparación... (pasos separados por coma)'
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

    marginTop: Constants.statusBarHeight,
    flexGrow: 1
  },
  text_title: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40
  },
  form_container: {
    flex: 1,
    marginTop: 50,
    gap: 10,
    alignItems: 'center'
  },
  input: {
    paddingHorizontal: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#884A39',
    borderRadius: 4,
    width: '90%',
    height: 40
  },
  inputAndroid: {
    paddingHorizontal: 5,
    fontSize: 16,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#884A39',
    borderRadius: 4,
    color: '#333',
    width: 370,
    height: 40
  },
  button: {
    marginTop: 15,
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  }
});

export default AddFormRecipe;
