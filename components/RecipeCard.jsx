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
  isNarrow = false,
  buttonShadowOffset,
  buttonShadowColor,
  buttonShadowPadding,
}) {
  const navigation = useNavigation();

  const changeScreen = useCallback(() => {
    navigation.navigate("DetailRecipe", { id: recipe.id });
  }, [navigation, recipe.id]);

  return (
    <View
      key={recipe.id}
      style={[styles.container, isNarrow && styles.containerNarrow]}
    >
      <View style={[styles.imageWrap, isNarrow && styles.imageWrapNarrow]}>
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
        <View style={[styles.badge, isNarrow && styles.badgeNarrow]}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {recipe.category}
          </Text>
        </View>
      ) : null}

      <View
        style={[styles.contentWrapper, isNarrow && styles.contentWrapperNarrow]}
      >
        <View style={styles.titleContainer}>
          <Text
            style={[styles.text_name, isNarrow && styles.textNameNarrow]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {recipe.name}
          </Text>
        </View>
      </View>

      <View
        style={[styles.timerSection, isNarrow && styles.timerSectionNarrow]}
      >
        <View style={[styles.timerBadge, isNarrow && styles.timerBadgeNarrow]}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={isNarrow ? 15 : 16}
            color={theme.colors.primary}
          />
          <Text style={[styles.text_time, isNarrow && styles.textTimeNarrow]}>
            {recipe.time} min
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.buttonContainer,
          isNarrow && styles.buttonContainerNarrow,
        ]}
      >
        <RetroButton
          onPress={changeScreen}
          style={[styles.buttonFull, isNarrow && styles.buttonFullNarrow]}
          shadowOffset={buttonShadowOffset}
          shadowColor={buttonShadowColor}
          shadowPadding={buttonShadowPadding}
        >
          <View
            style={[styles.buttonInner, isNarrow && styles.buttonInnerNarrow]}
          >
            <Text
              style={[styles.buttonLabel, isNarrow && styles.buttonLabelNarrow]}
            >
              Ver receta
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={isNarrow ? 17 : 18}
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
  containerNarrow: {
    height: 336,
    marginVertical: 8,
  },
  imageWrap: {
    width: "100%",
    height: "48%",
    position: "relative",
  },
  imageWrapNarrow: {
    height: "46%",
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
  badgeNarrow: {
    maxWidth: "62%",
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
  contentWrapperNarrow: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 44,
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
  textNameNarrow: {
    fontSize: 20,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  text_time: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSize.sm,
  },
  textTimeNarrow: {
    fontSize: 12,
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
  buttonContainerNarrow: {
    height: 64,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  buttonFull: {
    width: "90%",
    paddingVertical: 8,
  },
  buttonFullNarrow: {
    width: "100%",
    minHeight: 46,
    paddingVertical: 9,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonInnerNarrow: {
    gap: 8,
  },
  buttonLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.base,
  },
  buttonLabelNarrow: {
    fontSize: 15,
  },
  timerSectionNarrow: {
    bottom: 74,
  },
  timerBadgeNarrow: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  noImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surfaceElevated,
  },
});
