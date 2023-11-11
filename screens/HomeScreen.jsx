import { View, Text, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { getDayOfWeek, numberWeekDay } from '../utils/calculateDays';
import { saveStorage, removeStorage, getStorage } from '../utils/storage';
import { getRecipesWeek } from '../utils/getRecipesWeek';

const HomeScreen = () => {
  const recetas = getRecipesWeek();
  const [recipes, setRecipes] = useState();

  useEffect(() => {
    if (getDayOfWeek(numberWeekDay()) === 'Domingo') {
      removeStorage();
      saveStorage('weekStore', JSON.stringify(recetas));
      getStorage('weekStore')
        .then((result) => {
          // console.log('result', result);
          if (typeof result === 'string') {
            const parsedData = JSON.parse(result);
            setRecipes(parsedData);
          } else {
            console.log(
              'El valor obtenido no es un string válido en formato JSON.'
            );
          }
        })
        .catch((error) => {
          console.log('Error al obtener el valor:', error);
        });
    } else {
      getStorage('weekStore')
        .then((result) => {
          if (typeof result === 'string') {
            const parsedData = JSON.parse(result);
            setRecipes(parsedData);
          } else {
            console.log(
              'El valor obtenido no es un string válido en formato JSON.'
            );
          }
        })
        .catch((error) => {
          console.log('Error al obtener el valor:', error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Menu semanal</Text>
      <FlatList
        data={recipes}
        ItemSeparatorComponent={() => <Text />}
        renderItem={({ item: recipe, index }) => (
          <>
            <Text style={styles.text_day}>{getDayOfWeek(index)}</Text>
            <RecipeCard recipe={recipe} />
          </>
        )}
        keyExtractor={(recipe) => recipe.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight + 50,

    fontWeight: 'bold'
  },
  text_title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 40,
    marginBottom: 10
  },
  text_day: {
    fontSize: 15
  },
  listContent: {
    paddingTop: 15,
    flexGrow: 1,
    alignItems: 'center'
  }
});
