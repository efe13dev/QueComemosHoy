import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import { RecipeCard } from '../components/RecipeCard';
import { getRecipes } from '../data/api';
import React, { useEffect, useState } from 'react';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [refresing, setRefresing] = useState(false);

  const getListRecipes = async () => {
    const data = await getRecipes();
    setRecipes(data);
  };
  useEffect(() => {
    getListRecipes();
  }, [recipes]);

  const onRefresh = React.useCallback(async () => {
    setRefresing(true);
    await getListRecipes();
    setRefresing(false);
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text_title}>Mis recetas</Text>

      <FlatList
        data={recipes}
        ItemSeparatorComponent={() => <Text />}
        renderItem={({ item: recipe }) => <RecipeCard recipe={recipe} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresing}
            colors={['#884A39']}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export default MyRecipes;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 10,
    marginBottom: Constants.statusBarHeight + 50
  },
  text_title: {
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#884A39',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginVertical: 10
  },

  listContent: {
    paddingTop: 15,
    flexGrow: 1,
    alignItems: 'center'
  }
});
