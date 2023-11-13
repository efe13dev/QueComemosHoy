import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { RecipeCard } from '../components/RecipeCard';
import { getDayOfWeek } from '../utils/calculateDays';
import { saveStorage, removeStorage, getStorage } from '../utils/storage';
import { getRecipesWeek } from '../utils/getRecipesWeek';

const HomeScreen = () => {
  const [recipes, setRecipes] = useState();
  function loadRecipes() {
    const recipesWeek = getRecipesWeek();
    removeStorage();
    saveStorage('weekStore', JSON.stringify(recipesWeek));
    getStorage('weekStore').then((result) => {
      console.log(result);
      if (typeof result === 'string') {
        const parsedData = JSON.parse(result);
        setRecipes(parsedData);
      } else {
        console.log(
          'El valor obtenido no es un string válido en formato JSON.'
        );
      }
    });
  }
  useEffect(() => {
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
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Menú semanal</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            loadRecipes();
          }}
        >
          <Text style={styles.buttonText}>Crear Menú</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: Constants.statusBarHeight + 10,
    marginBottom: Constants.statusBarHeight + 100,

    fontWeight: 'bold'
  },
  text_title: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginVertical: 10
  },
  text_day: {
    color: '#884A39',
    fontWeight: 'bold',
    fontSize: 15
  },
  listContent: {
    paddingTop: 15,
    flexGrow: 1,
    alignItems: 'center'
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  }
});
