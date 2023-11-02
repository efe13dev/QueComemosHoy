import { View, Text, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { RecipeCard } from '../components/RecipeCard';
const recipes = require('../data/recipes.json');

const MyRecipes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Mis recetas</Text>

      <FlatList
        data={recipes}
        ItemSeparatorComponent={() => <Text />}
        renderItem={({ item: recipe }) => <RecipeCard recipe={recipe} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyRecipes;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 10,
    marginBottom: Constants.statusBarHeight + 40
  },
  text_title: {
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 40,
    marginBottom: 10
  },

  listContent: {
    paddingTop: 15,
    flexGrow: 1,
    alignItems: 'center'
  }
});
