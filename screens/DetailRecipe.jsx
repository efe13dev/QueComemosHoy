import { Text, StyleSheet, View, Image, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
const recipes = require('../data/recipes.json');

const DetailRecipe = ({ route }) => {
  const { id } = route.params;

  const recipe = recipes.find((recipe) => recipe.id === id);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: recipe.imagen }}
          style={styles.image}
        />
        <Text style={styles.title}>{recipe.nombre}</Text>
        <Text style={styles.textTime}>
          Tiempo de preparación:{' '}
          <Text style={styles.spanTime}>{recipe.tiempo}</Text>
        </Text>
      </View>
      <Text style={styles.titleIngredientsInstructions}>Ingredientes:</Text>
      <View style={styles.containerIngredientsInstructions}>
        {recipe.ingredientes?.map((ingrediente, index) => (
          <Text
            key={index}
            style={
              index % 2 === 0
                ? styles.listIngredientsInstructionsPar
                : styles.listIngredientsInstructionsOdd
            }
          >
            · {ingrediente}
          </Text>
        ))}
      </View>
      <Text style={styles.titleIngredientsInstructions}>Preparación:</Text>
      <View style={styles.containerIngredientsInstructions}>
        {recipe.preparacion?.map((paso, index) => (
          <Text
            key={index}
            style={
              index % 2 === 0
                ? styles.listIngredientsInstructionsPar
                : styles.listIngredientsInstructionsOdd
            }
          >
            · {paso}
          </Text>
        ))}
      </View>
      <View />
    </ScrollView>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    flexGrow: 1
  },
  containerIngredientsInstructions: {
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20
  },
  title: {
    color: '#884A39',
    fontSize: 35,
    fontWeight: 'bold',
    padding: 10
  },
  textTime: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10
  },
  titleIngredientsInstructions: {
    color: '#884A39',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10
  },
  listIngredientsInstructionsPar: {
    color: '#C07F00',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
  listIngredientsInstructionsOdd: {
    color: '#4C3D3D',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 10
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
  },
  spanTime: {
    color: 'darkorange',
    fontWeight: 'bold'
  }
});
