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
    const updatedRecipeWithNumberTime = {
      ...updatedRecipe,
      time: Number.parseInt(updatedRecipe.time, 10),
      people: Number.parseInt(updatedRecipe.people, 10),
    };

    await updateRecipe(id, updatedRecipeWithNumberTime);
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

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...updatedRecipe.ingredients];
    newIngredients[index] = text;
    setUpdatedRecipe({ ...updatedRecipe, ingredients: newIngredients });
  };

  const handlePreparationChange = (text, index) => {
    const newPreparation = [...updatedRecipe.preparation];
    newPreparation[index] = text;
    setUpdatedRecipe({ ...updatedRecipe, preparation: newPreparation });
  };

  const addInput = (field) => {
    setUpdatedRecipe({
      ...updatedRecipe,
      [field]: [...updatedRecipe[field], ''],
    });
  };

  const removeInput = (field, index) => {
    const updatedArray = [...updatedRecipe[field]];
    updatedArray.splice(index, 1);
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
          {updatedRecipe.ingredients && updatedRecipe.ingredients.map((ingredient, index) => (
            <View key={`ingredient-${index}`} style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={ingredient}
                onChangeText={(text) => handleIngredientChange(text, index)}
              />
              {index === updatedRecipe.ingredients.length - 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => addInput('ingredients')}
                >
                  <Icon name="add-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
              {updatedRecipe.ingredients.length > 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => removeInput('ingredients', index)}
                >
                  <Icon name="remove-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <Text style={styles.label}>Preparación</Text>
          {updatedRecipe.preparation && updatedRecipe.preparation.map((step, index) => (
            <View key={`preparation-${index}`} style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputFlex,
                  styles.preparationInput,
                ]}
                value={step}
                onChangeText={(text) => handlePreparationChange(text, index)}
                multiline
                numberOfLines={1}
                textAlignVertical="center"
                blurOnSubmit
                onSubmitEditing={() => {}}
              />
              {index === updatedRecipe.preparation.length - 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => addInput('preparation')}
                >
                  <Icon name="add-circle" size={30} color="#8B4513" />
                </TouchableOpacity>
              )}
              {updatedRecipe.preparation.length > 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => removeInput('preparation', index)}
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
        </>
      )}
    </ScrollView>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: '#FFF5E6',
    paddingTop: Constants.statusBarHeight,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20,
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
  },
  title: {
    color: '#663300',
    fontSize: 32,
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
  },
  spanTime: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  titleIngredientsInstructions: {
    color: '#663300',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE4B5',
  },
  containerIngredientsInstructions: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listIngredientsInstructionsPar: {
    color: '#663300',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
  },
  listIngredientsInstructionsOdd: {
    color: '#663300',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF5E6',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
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
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
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
