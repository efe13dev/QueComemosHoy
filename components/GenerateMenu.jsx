import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRecipes } from '../data/api';
import {
  actualizarRecetaDelDia,
  obtenerMenuSemanal,
} from '../utils/menuSemanal';
import WeekDayPicker from './WeekDayPicker';

const handleError = (error, message) => {
  // eslint-disable-next-line no-console
  console.error(error);
  Alert.alert('Error', message);
};

export function GenerateMenu() {
  const [recipesName, setRecipesName] = useState([]);
  const [weekMenu, setweekMenu] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getListRecipesName = useCallback(async () => {
    try {
      const data = await getRecipes();
      const dataName = data.map((item) => item.name);
      const recipeList = dataName
        .map((item) => ({
          label: item,
          value: item,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      setRecipesName(recipeList);
    } catch (error) {
      handleError(error, 'No se pudieron cargar las recetas');
    }
  }, []); // No tiene dependencias porque solo usa funciones externas y setState

  const loadMenuFromSupabase = useCallback(async () => {
    try {
      const { data: menu, error } = await obtenerMenuSemanal();
      if (error) throw error;

      const menuObject = {};
      for (const item of menu) {
        const newValue = item.menu_data?.trim() || '';
        if (menuObject[item.id] !== newValue) {
          menuObject[item.id] = newValue;
        }
      }
      setweekMenu(menuObject);
    } catch (error) {
      handleError(error, 'No se pudo cargar el menú');
    } finally {
      setIsLoading(false);
    }
  }, []); // No tiene dependencias porque solo usa funciones externas y setState

  useEffect(() => {
    if (isLoading) {
      getListRecipesName();
      loadMenuFromSupabase();
    }
  }, [isLoading, getListRecipesName, loadMenuFromSupabase]);

  const handleChange = useCallback(async (day, value) => {
    try {
      setweekMenu((prev) => ({
        ...prev,
        [day]: value,
      }));

      const { error } = await actualizarRecetaDelDia(day, value || ' ');
      if (error) {
        setweekMenu((prev) => ({
          ...prev,
          [day]: prev[day],
        }));
        throw error;
      }
    } catch (error) {
      handleError(error, 'No se pudo actualizar el menú');
    }
  }, []); // No tiene dependencias porque solo usa funciones externas y setState

  const resetMenu = useCallback(async () => {
    try {
      const promises = daysOfWeek.map((day) =>
        actualizarRecetaDelDia(day, ' ')
      );
      await Promise.all(promises);

      const updatedWeekMenu = {};
      for (const day of daysOfWeek) {
        updatedWeekMenu[day] = '';
      }
      setweekMenu(updatedWeekMenu);
      Alert.alert('Menú borrado', 'El menú semanal ha sido reiniciado.');
    } catch (error) {
      handleError(error, 'No se pudo reiniciar el menú');
    }
  }, []); // No tiene dependencias porque solo usa constantes y setState

  const confirmResetMenu = useCallback(() => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar el menú?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: resetMenu,
        },
      ],
      { cancelable: false }
    );
  }, [resetMenu]); // Depende de resetMenu porque lo usa como callback

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getListRecipesName(), loadMenuFromSupabase()]).finally(() => {
      setRefreshing(false);
    });
  }, [getListRecipesName, loadMenuFromSupabase]); // Depende de las funciones que llama

  const daysOfWeek = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Menú Semanal</Text>
        <View style={styles.menuContainer}>
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
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={confirmResetMenu}
      >
        <Text style={styles.resetButtonText}>Eliminar Menú</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#FFF5E6', // Color crema suave, como masa de pan
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513', // Marrón cálido, como canela
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFE4B5', // Color melocotón claro
  },
  resetButton: {
    backgroundColor: '#FF6B6B', // Rojo suave, como tomate
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
