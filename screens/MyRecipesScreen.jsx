import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import { RecipeCard } from '../components/RecipeCard';
import { getRecipes } from '../data/api';

const MyRecipes = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [refresing, setRefresing] = useState(false);

  const getListRecipes = async () => {
    const data = await getRecipes();
    const sortedData = data.sort((a, b) => a.id - b.id);
    setRecipes(sortedData);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListRecipes();
    });

    return unsubscribe;
  }, [navigation]);

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
            colors={['#9AD0C2']}
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
    marginBottom: Constants.statusBarHeight + 50
  },
  text_title: {
    textShadowColor: 'blue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
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
