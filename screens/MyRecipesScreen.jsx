import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import Constants from "expo-constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, View } from "react-native";

import { RecipeCard } from "../components/RecipeCard";
import NeoIcon from "../components/ui/NeoIcon";
import NeoTitle from "../components/ui/NeoTitle";
import RetroInput from "../components/ui/RetroInput";
import { getRecipes } from "../data/api";
import { hardShadow, outline, theme } from "../utils/theme";

const MyRecipes = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const ICON_SIZE = 50;
  const numColumns = 2;

  const filteredRecipes = useMemo(
    () =>
      recipes.filter((recipe) =>
        recipe.name.toLowerCase().startsWith(searchText.toLowerCase()),
      ),
    [searchText, recipes],
  );

  const getListRecipes = useCallback(async () => {
    const data = await getRecipes();
    const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

    setRecipes(sortedData);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getListRecipes();
    });

    return unsubscribe;
  }, [navigation, getListRecipes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getListRecipes();
    setRefreshing(false);
  }, [getListRecipes]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.recipeCardContainer}>
        <RecipeCard
          recipe={item}
          buttonShadowOffset={{
            default: { x: 3, y: 3 },
            pressed: { x: 1, y: 1 },
          }}
          buttonShadowColor="#000000"
          buttonShadowPadding="right"
        />
      </View>
    ),
    [],
  );

  const clearSearchText = () => {
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <NeoIcon
          name="silverware-fork-knife"
          size={ICON_SIZE}
          color={theme.colors.primary}
          shadowColor="#000000"
          shadowOffset={2.5}
        />
      </View>
      <NeoTitle
        text="Mis recetas"
        fontSize={theme.fontSize.xl}
        shadowColor={theme.colors.primary}
        marginBottom={theme.spacing.md}
      />
      <View style={styles.searchContainer}>
        <RetroInput
          placeholder="Buscar en mis recetas"
          value={searchText}
          onChangeText={setSearchText}
          containerStyle={styles.searchInputContainer}
          style={styles.searchInputText}
        />
        {/* Icono de búsqueda (lupa) superpuesto a la izquierda */}
        <View pointerEvents="none" style={styles.searchIconWrap}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={theme.colors.textMuted}
          />
        </View>
        {searchText !== "" ? (
          <Pressable
            style={styles.clearButton}
            onPress={clearSearchText}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={24} color={theme.colors.ink} />
          </Pressable>
        ) : null}
      </View>
      <FlashList
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={320}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 4,
    paddingBottom: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  recipeCardContainer: {
    flex: 1,
    margin: 5,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
    position: "relative",
    ...outline({ width: 3 }),
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.primary,
  },
  searchInputContainer: {
    flex: 1,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  searchInputText: {
    paddingLeft: 36,
    paddingRight: 40,
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  searchIconWrap: {
    position: "absolute",
    left: 18,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});

export default MyRecipes;
