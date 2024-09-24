import { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getRecipe, deleteRecipe, updateRecipe } from '../data/api';

const DetailRecipe = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({});

  const getListRecipe = async (id) => {
    const [data] = await getRecipe(id);
    setRecipe(data);
    setUpdatedRecipe(data);
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

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Asegúrate de que el campo 'time' sea un número
    const updatedRecipeWithNumberTime = {
      ...updatedRecipe,
      time: parseInt(updatedRecipe.time, 10)
    };

    await updateRecipe(id, updatedRecipeWithNumberTime);
    setIsEditing(false);
    Alert.alert(
      'Receta actualizada',
      'La receta se actualizó correctamente',
      [
        {
          text: 'Aceptar',
          onPress: () => getListRecipe(id)
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
                style={styles.updateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={showAlert}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            {isEditing ? (
              <>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.name}
                  onChangeText={(text) =>
                    setUpdatedRecipe({ ...updatedRecipe, name: text })
                  }
                />
                <Text style={styles.label}>Categoría</Text>
                <Text style={styles.categoryText}>{recipe.category}</Text>
                <Text style={styles.label}>Tiempo</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.time.toString()} // Asegúrate de que sea una cadena
                  onChangeText={(text) =>
                    setUpdatedRecipe({ ...updatedRecipe, time: text })
                  }
                  keyboardType='numeric' // Asegúrate de que el teclado sea numérico
                />
                <Text style={styles.label}>Imagen</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.image}
                  onChangeText={(text) =>
                    setUpdatedRecipe({ ...updatedRecipe, image: text })
                  }
                />
                <Text style={styles.label}>Personas</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.people.toString()} // Asegúrate de que sea una cadena
                  onChangeText={(text) =>
                    setUpdatedRecipe({ ...updatedRecipe, people: text })
                  }
                  keyboardType='numeric' // Asegúrate de que el teclado sea numérico
                />
                <Text style={styles.label}>Ingredientes</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.ingredients.join(', ')} // Convierte el array a una cadena
                  onChangeText={(text) =>
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      ingredients: text.split(', ')
                    })
                  }
                />
                <Text style={styles.label}>Preparación</Text>
                <TextInput
                  style={styles.input}
                  value={updatedRecipe.preparation.join(', ')} // Convierte el array a una cadena
                  onChangeText={(text) =>
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      preparation: text.split(', ')
                    })
                  }
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>{recipe.name}</Text>
                <Text style={styles.textTime}>
                  Tiempo de preparación:{' '}
                  <Text style={styles.spanTime}>{recipe.time} min</Text>
                </Text>
              </>
            )}
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
  },
  updateButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%'
  },
  saveButton: {
    backgroundColor: 'rgba(0, 128, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    width: '80%'
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 10,
    width: '80%'
  }
});
