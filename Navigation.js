import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import MyRecipes from './screens/MyRecipesScreen';
import DetailRecipe from './screens/DetailRecipeScreen';
import AddRecipe from './screens/AddRecipeScreen';

import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const MyStack = createNativeStackNavigator();

function HomeStack() {
  return (
    <MyStack.Navigator>
      <MyStack.Screen
        name='HomeScreenStack'
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      <MyStack.Screen
        name='DetailRecipe'
        component={DetailRecipe}
        options={{
          headerTitle: 'Volver'
        }}
      />
    </MyStack.Navigator>
  );
}
function RecipesStack() {
  return (
    <MyStack.Navigator>
      <MyStack.Screen
        name='MyRecipes'
        component={MyRecipes}
        options={{
          headerShown: false
        }}
      />
      <MyStack.Screen
        name='DetailRecipe'
        component={DetailRecipe}
        options={{
          headerTitle: 'Volver'
        }}
      />
    </MyStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarActiveTintColor: '#116A7B',
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
        name='MyRecipesScreen'
        component={RecipesStack}
        options={{
          tabBarActiveTintColor: '#116A7B',
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
        name='AddRecipeScreen'
        component={AddRecipe}
        options={{
          tabBarActiveTintColor: '#116A7B',
          tabBarLabel: 'Añadir receta',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='add-circle'
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
