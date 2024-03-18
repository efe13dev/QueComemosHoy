import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';

const HomeScreen = () => {
  // const [recipes, setRecipes] = useState();

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Menú semanal</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Crear Menú</Text>
        </TouchableOpacity>
      </View>
      <Text>HomeScreen</Text>
      {/* <FlatList
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
      /> */}
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
