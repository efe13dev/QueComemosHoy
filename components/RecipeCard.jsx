import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function RecipeCard({ recipe }) {
  const navigation = useNavigation();

  const changeScreen = () => {
    navigation.navigate("DetailRecipe", {
      id: recipe.id,
    });
  };

  return (
    <View key={recipe.id} style={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={styles.noImagePlaceholder} />
      )}

      <View style={styles.contentWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.text_name} numberOfLines={2} ellipsizeMode="tail">
            {recipe.name}
          </Text>
        </View>
      </View>

      <View style={styles.timerSection}>
        <View style={styles.containerTimer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color="#8B4513"
          />
          <Text style={styles.text_time}>{recipe.time} min</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={changeScreen}>
          <Text style={styles.buttonText}>Ver receta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 300,
    borderColor: "#FFE4B5",
    borderWidth: 1,
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  contentWrapper: {
    width: "100%",
    padding: 10,
    paddingBottom: 40,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  timerSection: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 65,
  },
  containerTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text_name: {
    color: "#663300",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  text_time: {
    color: "#8B4513",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#8B4513",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  noImagePlaceholder: {
    width: "100%",
    height: "50%",
    backgroundColor: "#FFE4B5",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  flexSpacer: {
    flex: 1,
  },
});
