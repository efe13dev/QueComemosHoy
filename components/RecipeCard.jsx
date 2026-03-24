import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

import { hardShadow, outline, theme } from "../utils/theme";

import RetroButton from "./ui/RetroButton";

function RecipeCardInner({
  recipe,
  buttonShadowOffset,
  buttonShadowColor,
  buttonShadowPadding,
}) {
  const navigation = useNavigation();

  const changeScreen = useCallback(() => {
    navigation.navigate("DetailRecipe", { id: recipe.id });
  }, [navigation, recipe.id]);

  return (
    <View key={recipe.id} style={styles.container}>
      <View style={styles.imageWrap}>
        {recipe.image ? (
          <Image
            source={{ uri: recipe.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.noImagePlaceholder} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)"]}
          style={styles.imageOverlay}
        />
      </View>

      <View style={styles.dividerLine} />

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
        <View style={styles.timerBadge}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.text_time}>{recipe.time} min</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <RetroButton
          onPress={changeScreen}
          style={styles.buttonFull}
          shadowOffset={buttonShadowOffset}
          shadowColor={buttonShadowColor}
          shadowPadding={buttonShadowPadding}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonLabel}>Ver receta</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={theme.colors.ink}
            />
          </View>
        </RetroButton>
      </View>
    </View>
  );
}

export const RecipeCard = memo(RecipeCardInner);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    width: "100%",
    height: 320,
    borderRadius: 0,
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 4, y: 4, elevation: 8 }),
    overflow: "hidden",
    position: "relative",
  },
  imageWrap: {
    width: "100%",
    height: "48%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  dividerLine: {
    width: "100%",
    height: 4,
    backgroundColor: theme.colors.primary,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: theme.colors.secondary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 0,
    ...outline({ width: 2 }),
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
    zIndex: 2,
  },
  badgeText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  contentWrapper: {
    width: "100%",
    padding: 10,
    paddingBottom: 36,
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
    bottom: 62,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 3,
    paddingHorizontal: 10,
    ...outline({ width: 2 }),
  },
  text_name: {
    color: theme.colors.textDark,
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fonts.extrabold,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 6,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  text_time: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSize.sm,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    height: 56,
  },
  buttonFull: {
    width: "90%",
    paddingVertical: 8,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.base,
  },
  noImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surfaceElevated,
  },
});
