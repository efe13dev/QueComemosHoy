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

      <View style={styles.contentContainer}>
        <Text style={styles.text_name}>{recipe.name}</Text>

        <View style={styles.containerTimer}>
          <Image
            source={timerIcon}
            style={styles.timerIcon}
          />
          <Text style={styles.text_time}>{recipe.time} min</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={changeScreen}
      >
        <Text style={styles.buttonText}>Ver receta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 300,
    borderColor: '#7AA2E3',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    overflow: 'hidden'
  },
  contentContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'center'
  },
  containerTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5
  },
  text_name: {
    color: '#265073',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  timerIcon: {
    width: 18,
    height: 18
  },
  text_time: {
    color: '#555',
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#6AD4DD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});
