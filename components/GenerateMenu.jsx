import React, { useEffect, useState, useCallback } from 'react';
import {
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
  obtenerMenuSemanalSinInicializar
} from '../utils/menuSemanal';
import WeekDayPicker from './WeekDayPicker';
import CustomModal from './CustomModal';

const handleError = (error, message) => {
  // eslint-disable-next-line no-console
  console.error(error);
};

export function GenerateMenu() {
  const [recipesName, setRecipesName] = useState([]);
  const [weekMenu, setweekMenu] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleError = useCallback((error, message) => {
    // eslint-disable-next-line no-console
    console.error(error);
    setErrorMessage(message);
    setErrorModalVisible(true);
  }, []);

  const getListRecipesName = useCallback(async () => {
    try {
      const data = await getRecipes();
      const dataName = data.map((item) => item.name);
      const recipeList = dataName
        .map((item) => ({
          label: item.trim(),
          value: item.trim(),
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      setRecipesName(recipeList);
    } catch (error) {
      handleError(error, 'No se pudieron cargar las recetas');
    }
  }, []); // No tiene dependencias porque solo usa funciones externas y setState

  const loadMenuFromSupabase = useCallback(async () => {
    try {
      // Usamos la nueva función que solo obtiene datos sin inicializar
      const { data: menu, error } = await obtenerMenuSemanalSinInicializar();
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

  const handleChange = useCallback(
    async (day, value) => {
      try {
        // Evitar actualizaciones si el valor es el mismo
        if (weekMenu[day] === value) {
          console.log(`Valor para ${day} sin cambios, no se actualiza`);
          return;
        }

        console.log(`Actualizando ${day} con valor: "${value}"`);

        // Guardar el valor anterior para poder revertir en caso de error
        const previousValue = weekMenu[day];

        // Actualizar el estado local primero para una experiencia de usuario más fluida
        setweekMenu((prev) => ({
          ...prev,
          [day]: value,
        }));

        // Asegurarse de que value no sea null o undefined antes de enviarlo
        const valueToSend = value || '';
        const { error } = await actualizarRecetaDelDia(day, valueToSend);

        if (error) {
          console.error(`Error al actualizar ${day}:`, error);
          // Revertir al valor anterior en caso de error
          setweekMenu((prev) => ({
            ...prev,
            [day]: previousValue,
          }));
          throw error;
        }
        
        console.log(`${day} actualizado exitosamente.`);
      } catch (error) {
        handleError(error, 'No se pudo actualizar el menú');
      }
    },
    [weekMenu]
  ); // Añadir weekMenu como dependencia para comparar valores

  const resetMenu = useCallback(async () => {
    try {
      setIsResetting(true);
      
      const diasSemana = [
        'lunes',
        'martes',
        'miercoles',
        'jueves',
        'viernes',
        'sabado',
        'domingo',
      ];
      
      console.log('Iniciando reseteo del menú semanal...');
      
      // Realizamos las actualizaciones una por una para mayor seguridad
      for (const dia of diasSemana) {
        console.log(`Reseteando ${dia}...`);
        const { error } = await actualizarRecetaDelDia(dia, ' ');
        if (error) {
          console.error(`Error al resetear ${dia}:`, error);
          throw error;
        }
      }

      // Actualizamos el estado local después de que todas las operaciones de DB sean exitosas
      const updatedWeekMenu = {};
      for (const dia of diasSemana) {
        updatedWeekMenu[dia] = '';
      }
      setweekMenu(updatedWeekMenu);
      
      console.log('Menú semanal reseteado exitosamente.');
      // Cerramos el modal de confirmación
      setResetModalVisible(false);
      // Pequeña pausa antes de mostrar el modal de éxito
      setTimeout(() => {
        // Mostramos el modal de éxito
        setSuccessModalVisible(true);
      }, 300);
    } catch (error) {
      handleError(error, 'No se pudo reiniciar el menú');
    } finally {
      setIsResetting(false);
    }
  }, []); // No tiene dependencias porque solo usa constantes y setState

  const confirmResetMenu = useCallback(() => {
    // Mostramos el modal de confirmación en lugar del Alert
    setResetModalVisible(true);
  }, []); // Ya no depende de resetMenu porque no lo llama directamente

  const handleConfirmReset = useCallback(() => {
    resetMenu();
  }, [resetMenu]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Usamos la función sin inicializar para el refresco también
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
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={['#A0522D']} 
          tintColor={'#A0522D'}
        />
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
        <TouchableOpacity 
          style={[styles.resetButton, isResetting && styles.resetButtonDisabled]} 
          onPress={confirmResetMenu}
          disabled={isResetting}
        >
          <Text style={styles.resetButtonText}>
            {isResetting ? 'Eliminando...' : 'Eliminar Menú'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación para resetear el menú */}
      <CustomModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        title="Confirmación"
        message="¿Estás seguro de que deseas eliminar el menú semanal?"
        icon="alert-circle"
        iconColor="#c63636"
        buttons={[
          {
            text: "Cancelar",
            onPress: () => setResetModalVisible(false),
            style: "cancel",
            disabled: isResetting
          },
          {
            text: "Eliminar",
            loadingText: "Eliminando...",
            loading: isResetting,
            onPress: () => {
              handleConfirmReset();
            }
          }
        ]}
      />

      {/* Modal de éxito después de resetear el menú */}
      <CustomModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Menú Eliminado"
        message="El menú semanal ha sido reiniciado exitosamente."
        icon="checkmark-circle"
        iconColor="#8B4513"
      />

      {/* Modal de error */}
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message={errorMessage}
        icon="alert-circle"
        iconColor="#c63636"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#663300',
    textShadowColor: 'rgba(102, 51, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  resetButton: {
    backgroundColor: '#FFE4B5',
    borderRadius: 15,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  resetButtonDisabled: {
    backgroundColor: '#F5DEB3',
    borderColor: '#D2B48C',
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#663300',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
