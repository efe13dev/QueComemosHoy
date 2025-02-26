import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteRecipe, getRecipe, updateRecipe } from '../data/api';

const DetailRecipe = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({});
  // Generador de ID único
  const generateUniqueId = () =>
    `id_${Math.random().toString(36).substr(2, 9)}`;

  const getListRecipe = async (id) => {
    const [data] = await getRecipe(id);
    // Asignar IDs únicos a ingredientes y pasos si no los tienen
    const enhancedData = {
      ...data,
      ingredients: data.ingredients.map((ingredient) =>
        typeof ingredient === 'string'
          ? { id: generateUniqueId(), text: ingredient }
          : ingredient
      ),
      preparation: data.preparation.map((step) =>
        typeof step === 'string' ? { id: generateUniqueId(), text: step } : step
      ),
    };
    setRecipe(enhancedData);
    setUpdatedRecipe(enhancedData);
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
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: handleDelete,
        },
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
          onPress: navigation.navigate('MyRecipes'),
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Convertir de vuelta a formato simple para guardar
    const simplifiedRecipe = {
      ...updatedRecipe,
      time: Number.parseInt(updatedRecipe.time, 10),
      people: Number.parseInt(updatedRecipe.people, 10),
      ingredients: updatedRecipe.ingredients.map((item) => item.text),
      preparation: updatedRecipe.preparation.map((item) => item.text),
    };

    await updateRecipe(id, simplifiedRecipe);
    setIsEditing(false);
    Alert.alert(
      'Receta actualizada',
      'La receta se actualizó correctamente',
      [
        {
          text: 'Aceptar',
          onPress: () => getListRecipe(id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleIngredientChange = (text, ingredientId) => {
    const newIngredients = updatedRecipe?.ingredients?.map((item) =>
      item.id === ingredientId ? { ...item, text } : item
    );
    setUpdatedRecipe({ ...updatedRecipe, ingredients: newIngredients });
  };

  const handlePreparationChange = (text, stepId) => {
    const newPreparation = updatedRecipe?.preparation?.map((item) =>
      item.id === stepId ? { ...item, text } : item
    );
    setUpdatedRecipe({ ...updatedRecipe, preparation: newPreparation });
  };

  const addInput = (field) => {
    const newItem = { id: generateUniqueId(), text: '' };
    setUpdatedRecipe({
      ...updatedRecipe,
      [field]: [...(updatedRecipe[field] || []), newItem],
    });
  };

  const removeInput = (field, itemId) => {
    const updatedArray = updatedRecipe[field].filter(
      (item) => item.id !== itemId
    );
    setUpdatedRecipe({
      ...updatedRecipe,
      [field]: updatedArray,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {recipe && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <MaterialCommunityIcons name="pencil" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={showAlert}>
            <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      {isEditing && updatedRecipe ? (
        <>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.name || ''}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, name: text })
            }
          />
          <Text style={styles.label}>Categoría</Text>
          {recipe && <Text style={styles.categoryText}>{recipe.category}</Text>}
          <Text style={styles.label}>Tiempo (min)</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.time ? updatedRecipe.time.toString() : '0'}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, time: text })
            }
            keyboardType="numeric"
          />
          <Text style={styles.label}>Imagen (URL)</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.image || ''}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, image: text })
            }
          />
          <Text style={styles.label}>Personas</Text>
          <TextInput
            style={styles.input}
            value={updatedRecipe.people ? updatedRecipe.people.toString() : '1'}
            onChangeText={(text) =>
              setUpdatedRecipe({ ...updatedRecipe, people: text })
            }
            keyboardType="numeric"
          />
          <Text style={styles.label}>Ingredientes</Text>
          {updatedRecipe?.ingredients?.map((ingredient) => (
            <View key={ingredient.id} style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={ingredient.text}
                onChangeText={(text) =>
                  handleIngredientChange(text, ingredient.id)
                }
              />
              {ingredient.id ===
                updatedRecipe?.ingredients[updatedRecipe.ingredients.length - 1]
                  ?.id && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => addInput('ingredients')}
                >
                  <Icon name="add-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
              {updatedRecipe?.ingredients?.length > 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => removeInput('ingredients', ingredient.id)}
                >
                  <Icon name="remove-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <Text style={styles.label}>Preparación</Text>
          {updatedRecipe?.preparation?.map((step) => (
            <View key={step.id} style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputFlex,
                  styles.preparationInput,
                ]}
                value={step.text}
                onChangeText={(text) => handlePreparationChange(text, step.id)}
                multiline
                numberOfLines={1}
                textAlignVertical="center"
                blurOnSubmit
                onSubmitEditing={() => {}}
              />
              {step.id ===
                updatedRecipe?.preparation[updatedRecipe.preparation.length - 1]
                  ?.id && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => addInput('preparation')}
                >
                  <Icon name="add-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
              {updatedRecipe?.preparation?.length > 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => removeInput('preparation', step.id)}
                >
                  <Icon name="remove-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </>
      ) : (
        recipe && (
          <>
            <Text style={styles.title}>{recipe.name}</Text>
            <Text style={styles.textTime}>
              Tiempo de preparación:{' '}
              <Text style={styles.spanTime}>{recipe.time} min</Text>
            </Text>
          </>
        )
      )}
      {recipe && (
        <>
          <Text style={styles.titleIngredientsInstructions}>Ingredientes:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.ingredients?.map((ingredient) => (
              <Text
                key={ingredient.id}
                style={
                  recipe.ingredients.indexOf(ingredient) % 2 === 0
                    ? styles.listIngredientsInstructionsPar
                    : styles.listIngredientsInstructionsOdd
                }
              >
                · {ingredient.text}
              </Text>
            ))}
          </View>
          <Text style={styles.titleIngredientsInstructions}>Preparación:</Text>
          <View style={styles.containerIngredientsInstructions}>
            {recipe.preparation?.map((step) => (
              <Text
                key={step.id}
                style={
                  recipe.preparation.indexOf(step) % 2 === 0
                    ? styles.listIngredientsInstructionsPar
                    : styles.listIngredientsInstructionsOdd
                }
              >
                · {step.text}
              </Text>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF5E6',
    paddingTop: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    color: '#663300',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textTime: {
    color: '#663300',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  spanTime: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  titleIngredientsInstructions: {
    color: '#663300',
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE4B5',
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  containerIngredientsInstructions: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  listIngredientsInstructionsPar: {
    color: '#663300',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  listIngredientsInstructionsOdd: {
    color: '#663300',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  updateButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: '#FFE4B5',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '90%',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
    width: '90%',
    color: '#663300',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
  },
  inputFlex: {
    flex: 1,
    marginRight: 5, // Reducido de 10 a 5
  },
  iconButton: {
    padding: 5, // Reducido de 10 a 5
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5, // Reducido de 10 a 5
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 10,
    width: '90%',
    color: '#663300',
    fontStyle: 'italic',
  },
  preparationInput: {
    height: 'auto',
    minHeight: 50,
    textAlignVertical: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
