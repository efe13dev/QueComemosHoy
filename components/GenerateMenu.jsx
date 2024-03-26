import { View, StyleSheet } from 'react-native';
import { getRecipes } from '../data/api';
import React, { useEffect, useState } from 'react';
import WeekDayPicker from './WeekDayPicker';

export function GenerateMenu() {
  const [recipesName, setRecipesName] = useState([]);

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
  }, []);

  const [menuSemanal, setMenuSemanal] = useState({});

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
    setMenuSemanal({ ...menuSemanal, [day]: value });
  };

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <WeekDayPicker
          key={day}
          day={day}
          handleChange={handleChange}
          recipesName={recipesName}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#D7C0AE',
    borderWidth: 2,
    borderRadius: 10,
    width: 350,
    height: 480,
    marginTop: 25,
    gap: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  }
});
