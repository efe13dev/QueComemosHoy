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
    const recipeList = dataName.map((item) => ({
      label: item,
      value: item
    }));

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
        onPress={resetMenu}
      >
        <Text style={styles.button_text}>Eliminar Menú</Text>
      </TouchableOpacity>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#7AA2E3',
    borderWidth: 2,
    borderRadius: 10,
    width: 350,
    height: 560,
    marginTop: 15,
    gap: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  button_container: {
    width: 130,
    marginTop: 50,

    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  button_text: {
    color: '#393939',
    backgroundColor: '#6AD4DD',
    padding: 8,
    borderRadius: 10,
    fontWeight: '600'
  }
});
