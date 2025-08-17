import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { RecipeCard } from "../components/RecipeCard";
import RetroInput from "../components/ui/RetroInput";
import { getRecipes } from "../data/api";
import { hardShadow, theme } from "../utils/theme";

const MyRecipes = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();

  const ICON_SIZE = 50;
  const numColumns = 2; // Definimos esto como una constante

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

  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().startsWith(searchText.toLowerCase()),
    );

    setFilteredRecipes(filtered);
  }, [searchText, recipes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getListRecipes();
    setRefreshing(false);
  }, [getListRecipes]);

  const renderItem = ({ item }) => (
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
  );

  // Usamos useMemo para crear una key única basada en el ancho de la pantalla
  const flatListKey = useMemo(() => `flatList-${width}`, [width]);

  const clearSearchText = () => {
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View
          style={[styles.iconWrap, { width: ICON_SIZE, height: ICON_SIZE }]}
        >
          {/* Sombra negra del icono (duplicado detrás) */}
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={ICON_SIZE}
            color="#000000"
            style={styles.recipeIconShadow}
          />
          {/* Icono principal */}
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={ICON_SIZE}
            color={theme.colors.primary}
            style={styles.recipeIcon}
          />
        </View>
      </View>
      {/* Título con sombras superpuestas al estilo GenerateMenu */}
      <View style={styles.titleWrap}>
        <Text style={styles.text_titleShadow}>Mis recetas</Text>
        <Text style={styles.text_titleShadow2}>Mis recetas</Text>
        <Text style={styles.text_titleShadow3}>Mis recetas</Text>
        <Text style={styles.text_titleShadow4}>Mis recetas</Text>
        <Text style={styles.text_title}>Mis recetas</Text>
      </View>
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
        {searchText !== "" && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearchText}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={24} color={theme.colors.ink} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        key={flatListKey}
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
  iconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    position: "relative",
    alignItems: "center",
  },
  text_title: {
    color: theme.colors.textDark,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginBottom: theme.spacing.md,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 1,
  },
  text_titleShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: 2 }, { translateY: 2 }],
    zIndex: 0,
  },
  text_titleShadow2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: -2 }, { translateY: 0 }],
    zIndex: 0,
  },
  text_titleShadow3: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: 0 }, { translateY: -2 }],
    zIndex: 0,
  },
  text_titleShadow4: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: "center",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    zIndex: 0,
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
  },
  searchInputContainer: {
    flex: 1,
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
  recipeIcon: {
    ...hardShadow({ x: 3, y: 3, elevation: 6 }),
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  recipeIconShadow: {
    position: "absolute",
    left: 0,
    top: 0,
    transform: [{ translateX: 2.5 }, { translateY: 2.5 }],
    zIndex: 0,
  },
});

export default MyRecipes;
