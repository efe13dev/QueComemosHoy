import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import timerIcon from '../assets/relojIcono.png';

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
      {recipe.image ? (
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.text_name}>{recipe.name}</Text>

      <View style={styles.container2}>
        <View style={styles.containerTimer}>
          <Image
            source={timerIcon}
            style={styles.timerIcon}
          />
          <Text style={styles.text_time}>{recipe.time} min</Text>
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
    width: 300,
    height: 260,
    borderColor: '#7AA2E3',
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
    textShadowColor: '#666',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    color: '#265073',
    fontSize: 20,
    fontWeight: '400'
  },
  image: {
    width: '80%',
    height: '50%',
    borderRadius: 10
  },
  timerIcon: {
    width: 20,
    height: 20
  },
  text_time: {
    color: '#393939',
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#6AD4DD',
    padding: 8,
    borderRadius: 10
  },
  buttonText: {
    color: '#393939',
    fontWeight: '500'
  }
});
