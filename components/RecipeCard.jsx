import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { hardShadow, outline, theme } from "../utils/theme";

import RetroButton from "./ui/RetroButton";

export function RecipeCard({
  recipe,
  buttonShadowOffset,
  buttonShadowColor,
  buttonShadowPadding,
}) {
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

      {recipe?.category ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {recipe.category}
          </Text>
        </View>
      ) : null}

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
            color={theme.colors.primary}
          />
          <Text style={styles.text_time}>{recipe.time} min</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <RetroButton
          title="Ver receta"
          onPress={changeScreen}
          style={styles.buttonFull}
          shadowOffset={buttonShadowOffset}
          shadowColor={buttonShadowColor}
          shadowPadding={buttonShadowPadding}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    width: "100%",
    height: 300,
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    overflow: "hidden",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: theme.colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 0,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
    zIndex: 2,
  },
  badgeText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
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
    color: theme.colors.textDark,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  image: {
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  text_time: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    height: 60,
  },
  buttonFull: {
    width: "90%",
    paddingVertical: 8,
  },
  noImagePlaceholder: {
    width: "100%",
    height: "50%",
    backgroundColor: theme.colors.surfaceAlt,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  flexSpacer: {
    flex: 1,
  },
});
