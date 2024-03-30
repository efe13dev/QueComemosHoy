import { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getRecipe, deleteRecipe } from '../data/api';
const DetailRecipe = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState();

  const getListRecipe = async (id) => {
    const [data] = await getRecipe(id);
    setRecipe(data);
  };
  useEffect(() => {
    getListRecipe(id);
  }, []);
  const showAlert = () => {
    Alert.alert(
      'Eliminar receta',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        {
          text: 'Cancelar',

          style: 'cancel'
        },
        {
          text: 'Aceptar',
          onPress: handleDelete
        }
      ],
      { cancelable: false }
    );
  };
  const handleDelete = async () => {
    await deleteRecipe(id);
    Alert.alert(
      'Receta eliminada',
      'La receta se eliminó correctamente',
      [
        {
          text: 'Aceptar',
          onPress: navigation.navigate('MyRecipes')
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      {recipe && (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: recipe.image }}
                style={styles.image}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={showAlert}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{recipe.name}</Text>

            <Text style={styles.textTime}>
              Tiempo de preparación:{' '}
              <Text style={styles.spanTime}>{recipe.time} min</Text>
            </Text>
          </View>
          <Text style={styles.titleIngredientsInstructions}>Ingredientes:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.ingredients?.map((ingredient, index) => (
              <Text
                key={index}
                style={
                  index % 2 === 0
                    ? styles.listIngredientsInstructionsPar
                    : styles.listIngredientsInstructionsOdd
                }
              >
                · {ingredient}
              </Text>
            ))}
          </View>
          <Text style={styles.titleIngredientsInstructions}>Preparación:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.preparation?.map((step, index) => (
              <Text
                key={index}
                style={
                  index % 2 === 0
                    ? styles.listIngredientsInstructionsPar
                    : styles.listIngredientsInstructionsOdd
                }
              >
                · {step}
              </Text>
            ))}
          </View>
          <View />
        </ScrollView>
      )}
    </>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    flexGrow: 1
  },
  imageContainer: {
    position: 'relative'
  },
  button: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#800000', // Granate oscuro
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  containerIngredientsInstructions: {
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20
  },
  title: {
    color: '#192655',
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
    color: '#2D9596',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10
  },
  listIngredientsInstructionsPar: {
    color: '#3876BF',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
  listIngredientsInstructionsOdd: {
    color: '#2D3250',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 10
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
