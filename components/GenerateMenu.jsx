import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeekDayPicker from './WeekDayPicker';
import { getRecipes } from '../data/api';

export function GenerateMenu() {
  const [recipesName, setRecipesName] = useState([]);
  const [weekMenu, setweekMenu] = useState({});

  const getListRecipesName = async () => {
    const data = await getRecipes();
    const dataName = data.map((item) => item.name);
    const recipeList = dataName
      .map((item) => ({
        label: item,
        value: item
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Ordenar por nombre

    setRecipesName(recipeList);
  };
  useEffect(() => {
    getListRecipesName();
    loadMenuFromStorage();
  }, []);

  const loadMenuFromStorage = async () => {
    try {
      const menu = await AsyncStorage.getItem('weekMenu');
      if (menu !== null) {
        setweekMenu(JSON.parse(menu));
      }
    } catch (error) {
      console.error('Error loading menu from AsyncStorage:', error);
    }
  };

  const saveMenuToStorage = async () => {
    try {
      const alMenosUnoNoEsNull = Object.values(weekMenu).some(
        (valor) => valor !== null
      );

      if (alMenosUnoNoEsNull) {
        await AsyncStorage.setItem('weekMenu', JSON.stringify(weekMenu));
      }
    } catch (error) {
      console.error('Error saving menu to AsyncStorage:', error);
    }
  };
  const resetMenu = async () => {
    try {
      await AsyncStorage.removeItem('weekMenu');
      const updatedWeekMenu = {};
      for (const day of daysOfWeek) {
        updatedWeekMenu[day] = '';
      }
      Alert.alert(
        'Valores borrados',
        'Los valores se han reseteado y el AsyncStorage ha sido borrado.'
      );
      setweekMenu(updatedWeekMenu);
    } catch (error) {
      console.error('Error resetting menu and AsyncStorage:', error);
    }
  };

  const confirmResetMenu = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar el menú?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: resetMenu
        }
      ],
      { cancelable: false }
    );
  };

  const daysOfWeek = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const handleChange = (day, value) => {
    const updateMenu = { ...weekMenu, [day]: value };
    setweekMenu(updateMenu);
    saveMenuToStorage();
  };

  return (
    <>
      <View style={styles.container}>
        {daysOfWeek.map((day) => (
          <WeekDayPicker
            key={day}
            day={day}
            handleChange={handleChange}
            recipesName={recipesName}
            selectedRecipe={weekMenu[day]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button_container}
        onPress={confirmResetMenu}
      >
        <Text style={styles.button_text}>Eliminar Menú</Text>
      </TouchableOpacity>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#999',
    borderWidth: 2,
    borderRadius: 10,
    width: 350,
    height: 600, // Aumentado la altura del componente
    marginTop: 15,
    gap: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  button_container: {
    width: 150, // Aumentado el ancho del botón
    marginTop: 30,
    alignSelf: 'center',
    paddingHorizontal: 15, // Aumentado el padding horizontal
    paddingVertical: 10, // Añadido padding vertical
    backgroundColor: '#FF6B6B', // Cambiado el color de fondo
    borderRadius: 10,
    shadowColor: '#000', // Añadida sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5 // Añadida elevación para Android
  },
  button_text: {
    color: '#FFF', // Cambiado el color del texto a blanco
    fontSize: 16, // Aumentado el tamaño de la fuente
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
