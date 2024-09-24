import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { RecipeCard } from '../components/RecipeCard';
import { getRecipes } from '../data/api';

const MyRecipes = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { width } = useWindowDimensions();

  const numColumns = 2; // Definimos esto como una constante

  const getListRecipes = async () => {
    const data = await getRecipes();
    const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
    setRecipes(sortedData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListRecipes();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }, [searchText, recipes]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getListRecipes();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.recipeCardContainer}>
      <RecipeCard recipe={item} />
    </View>
  );

  // Usamos useMemo para crear una key única basada en el ancho de la pantalla
  const flatListKey = useMemo(() => `flatList-${width}`, [width]);

  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Mis recetas</Text>
      <TextInput
        style={styles.searchInput}
        placeholder='Buscar receta...'
        value={searchText}
        onChangeText={setSearchText}
      />
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
            colors={['#9AD0C2']}
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
    paddingTop: Constants.statusBarHeight
  },
  text_title: {
    textShadowColor: 'blue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginVertical: 20
  },
  listContent: {
    paddingHorizontal: 0
  },
  recipeCardContainer: {
    flex: 1,
    margin: 5,
    width: '100%' // Hacemos las tarjetas un poco más anchas
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 10
  }
});

export default MyRecipes;
