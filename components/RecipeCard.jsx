import React from 'react';
import { useNavigation } from '@react-navigation/native';
import timerIcon from '../assets/relojIcono.png';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export function RecipeCard({ recipe }) {
  const navigation = useNavigation();

  const changeScreen = () => {
    navigation.navigate('DetailRecipe', {
      id: recipe.id
    });
  };
  return (
    <View
      key={recipe.id}
      style={styles.container}
    >
      {recipe.imagen ? (
        <Image
          source={{ uri: recipe.imagen }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.text_name}>{recipe.nombre}</Text>
      <View style={styles.container2}>
        <View style={styles.containerTimer}>
          <Image
            source={timerIcon}
            style={styles.timerIcon}
          />
          <Text style={styles.text_time}>{recipe.tiempo}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={changeScreen}
        >
          <Text style={styles.buttonText}>Ver receta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    maxWidth: '75%',
    width: 250,
    height: 230,
    borderColor: '#D7C0AE',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5
  },
  container2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  containerTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  text_name: {
    textShadowColor: '#B0A695',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    color: '#776B5D',
    fontSize: 20
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 10
  },
  timerIcon: {
    width: 20,
    height: 20
  },
  text_time: {
    color: '#594545',
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#D7C0AE',
    padding: 8,
    borderRadius: 10
  },
  buttonText: {
    color: '#594545',
    fontWeight: '500'
  }
});
