import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { RecipeCard } from "../components/RecipeCard";
import { getRecipes } from "../data/api";

const MyRecipes = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();

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
      <RecipeCard recipe={item} />
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
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={50}
          color="#8B4513"
          style={styles.recipeIcon}
        />
      </View>
      <Text style={styles.text_title}>Mis recetas</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar receta..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== "" && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearchText}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={24} color="#8B4513" />
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
            colors={["#A0522D"]}
            tintColor="#A0522D"
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
    backgroundColor: "#FFF5E6",
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
  text_title: {
    color: "#663300",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 15,
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#8B4513",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 40,
    backgroundColor: "#FFFFFF",
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  recipeIcon: {
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MyRecipes;
