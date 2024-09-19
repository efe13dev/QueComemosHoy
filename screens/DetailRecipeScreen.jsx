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
    marginTop: 20,
    flexGrow: 1,
    backgroundColor: '#f9f9f9'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  button: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(128, 0, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    color: '#192655',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  textTime: {
    color: '#4a4a4a',
    fontSize: 18,
    marginBottom: 20
  },
  spanTime: {
    color: '#ff6b35',
    fontWeight: 'bold'
  },
  titleIngredientsInstructions: {
    color: '#2D9596',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0'
  },
  containerIngredientsInstructions: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  listIngredientsInstructionsPar: {
    color: '#3876BF',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    marginBottom: 10
  },
  listIngredientsInstructionsOdd: {
    color: '#2D3250',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10
  }
});
