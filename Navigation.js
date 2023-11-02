import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import MyRecipes from './screens/MyRecipes';
import DetailRecipe from './screens/DetailRecipe';
import RandomRecipes from './screens/RandomRecipes';

import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const MyRecipesStack = createNativeStackNavigator();

function MyStack() {
  return (
    <MyRecipesStack.Navigator initialRouteName='MyRecipesStack'>
      <MyRecipesStack.Screen
        name='DetailRecipe'
        component={DetailRecipe}
        options={{
          headerTitle: 'Volver'
        }}
      />
      <MyRecipesStack.Screen
        name='MyRecipesStack'
        component={MyRecipes}
        options={{
          headerShown: false
        }}
      />
    </MyRecipesStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName='Inicio'>
      <Tab.Screen
        name='Inicio'
        component={HomeScreen}
        options={{
          tabBarActiveTintColor: '#827469',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name='home'
              size={24}
              color={color}
            />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name='MyRecipes'
        component={MyStack}
        options={{
          tabBarActiveTintColor: '#827469',
          tabBarLabel: 'Mis recetas',
          tabBarIcon: ({ color, size }) => (
            <Entypo
              name='bowl'
              size={24}
              color={color}
            />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Buscar receta'
        component={RandomRecipes}
        options={{
          tabBarActiveTintColor: '#827469',
          tabBarLabel: 'Buscar receta',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='ios-search'
              size={24}
              color={color}
            />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
