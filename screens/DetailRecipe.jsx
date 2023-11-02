import { Text, StyleSheet, View, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
const recipes = require('../data/recipes.json');

const DetailRecipe = ({ route }) => {
  const { id } = route.params;

  const recipe = recipes.find((recipe) => recipe.id === id);

  return (
    <View>
      <View style={styles.container}>
        <Image
          source={{ uri: recipe.imagen }}
          style={styles.image}
        />
        <Text style={styles.title}>{recipe.nombre}</Text>
        <Text style={styles.textTime}>
          Tiempo de preparación: {recipe.tiempo}
        </Text>
      </View>
      <Text style={styles.titleIngredients}>Ingredientes:</Text>
      <View style={styles.containerIngredients}>
        {recipe.ingredientes?.map((ingrediente, index) => (
          <Text
            key={index}
            style={styles.listIngredients}
          >
            {ingrediente}
          </Text>
        ))}
      </View>
      <View />
    </View>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    flexGrow: 1
  },
  containerIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,

    gap: 10
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    padding: 10
  },
  textTime: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10
  },
  titleIngredients: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  listIngredients: {
    fontSize: 17,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  },
  image: {
    width: 400,
    height: 300,
    borderRadius: 10
  }
});
