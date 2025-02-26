import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MyRecipes from './screens/MyRecipesScreen';
import DetailRecipe from './screens/DetailRecipeScreen';
import AddRecipe from './screens/AddRecipeScreen';
import SplashScreen from './screens/SplashScreen'; // Importa tu SplashScreen aquí

import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();
const MyStack = createNativeStackNavigator();

function HomeStack() {
  return (
    <MyStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5E6',
        },
        headerTintColor: '#663300',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <MyStack.Screen
        name='HomeScreenStack'
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      {/* <MyStack.Screen
        name='DetailRecipe'
        component={DetailRecipe}
        options={{
          headerTitle: 'Volver'
        }}
      /> */}
      <MyStack.Screen
        name='AddRecipe'
        component={AddRecipe}
        options={{
          headerTitle: 'Actualizar Receta'
        }}
      />
    </MyStack.Navigator>
  );
}

function RecipesStack() {
  return (
    <MyStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5E6',
        },
        headerTintColor: '#663300',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
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
      <MyStack.Screen
        name='AddRecipe'
        component={AddRecipe}
        options={{
          headerTitle: 'Actualizar Receta'
        }}
      />
    </MyStack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFF5E6',
          borderTopColor: '#FFE4B5',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          elevation: 8, // Sombra para Android
          shadowOpacity: 0.1, // Sombra para iOS
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#A0522D', // Color más suave, marrón siena
        tabBarInactiveTintColor: '#663300',
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? '#A0522D' : '#663300',
              fontSize: focused ? 13 : 12,
              fontWeight: focused ? 'bold' : '500',
              marginTop: -5
            }}>
              Inicio
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? {
              shadowColor: '#A0522D',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5, // Reducida la opacidad de la sombra
              shadowRadius: 2,
              elevation: 3, // Reducida la elevación
            } : {}}>
              <FontAwesome
                name='home'
                size={focused ? 30 : 24} // Aún más grande cuando está activo
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name='MyRecipesScreen'
        component={RecipesStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? '#A0522D' : '#663300',
              fontSize: focused ? 13 : 12,
              fontWeight: focused ? 'bold' : '500',
              marginTop: -5
            }}>
              Mis recetas
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? {
              shadowColor: '#A0522D',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5, // Reducida la opacidad de la sombra
              shadowRadius: 2,
              elevation: 3, // Reducida la elevación
            } : {}}>
              <Entypo
                name='bowl'
                size={focused ? 30 : 24} // Aún más grande cuando está activo
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name='AddRecipeScreen'
        component={AddRecipe}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              color: focused ? '#A0522D' : '#663300',
              fontSize: focused ? 13 : 12,
              fontWeight: focused ? 'bold' : '500',
              marginTop: -5
            }}>
              Añadir receta
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? {
              shadowColor: '#A0522D',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5, // Reducida la opacidad de la sombra
              shadowRadius: 2,
              elevation: 3, // Reducida la elevación
            } : {}}>
              <Ionicons
                name='add-circle'
                size={focused ? 30 : 24} // Aún más grande cuando está activo
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isSplashScreenVisible, setSplashScreenVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenVisible(false);
    }, 2500); // Reducimos el tiempo de 3500ms a 2500ms para que el splash screen se muestre menos tiempo

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {isSplashScreenVisible ? <SplashScreen /> : <MyTabs />}
    </NavigationContainer>
  );
}
