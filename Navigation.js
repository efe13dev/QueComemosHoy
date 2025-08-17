import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import AddRecipe from "./screens/AddRecipeScreen";
import DetailRecipe from "./screens/DetailRecipeScreen";
import HomeScreen from "./screens/HomeScreen";
import MyRecipes from "./screens/MyRecipesScreen";
import SplashScreen from "./screens/SplashScreen";
import { hardShadow, outline, theme } from "./utils/theme";

const Tab = createBottomTabNavigator();
const MyStack = createNativeStackNavigator();

function HomeStack() {
  return (
    <MyStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surfaceAlt,
          ...outline({ width: 3 }),
          ...hardShadow({ x: 2, y: 2, elevation: 4 }),
        },
        headerTintColor: theme.colors.textDark,
        headerTitleStyle: {
          fontFamily: theme.fonts.bold,
          textShadowColor: theme.colors.primary,
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 0,
        },
      }}
    >
      <MyStack.Screen
        name="HomeScreenStack"
        component={HomeScreen}
        options={{
          headerShown: false,
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
        name="AddRecipe"
        component={AddRecipe}
        options={{
          headerTitle: "Actualizar Receta",
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
          backgroundColor: theme.colors.surfaceAlt,
          ...outline({ width: 3 }),
          ...hardShadow({ x: 2, y: 2, elevation: 4 }),
        },
        headerTintColor: theme.colors.textDark,
        headerTitleStyle: {
          fontFamily: theme.fonts.bold,
          textShadowColor: theme.colors.primary,
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 0,
        },
      }}
    >
      <MyStack.Screen
        name="MyRecipes"
        component={MyRecipes}
        options={{
          headerShown: false,
        }}
      />
      <MyStack.Screen
        name="DetailRecipe"
        component={DetailRecipe}
        options={{
          headerTitle: "Volver",
        }}
      />
      <MyStack.Screen
        name="AddRecipe"
        component={AddRecipe}
        options={{
          headerTitle: "Actualizar Receta",
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
          backgroundColor: theme.colors.surfaceAlt,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          ...outline({ width: 3 }),
          ...hardShadow({ x: 2, y: 2, elevation: 6 }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.medium,
          textShadowColor: theme.colors.primary,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 0,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textDark,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: focused ? 13 : 12,
                fontFamily: focused ? theme.fonts.bold : theme.fonts.medium,
                textShadowColor: "#FF7A00",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 0,
                marginTop: -5,
              }}
            >
              Inicio
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={focused ? hardShadow({ x: 2, y: 2, elevation: 3 }) : null}
            >
              <FontAwesome
                name="home"
                size={focused ? 30 : 24}
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          tabBarActiveTintColor: "#FF7A00",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyRecipesScreen"
        component={RecipesStack}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: focused ? 13 : 12,
                fontFamily: focused ? theme.fonts.bold : theme.fonts.medium,
                textShadowColor: theme.colors.primary,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 0,
                marginTop: -5,
              }}
            >
              Mis recetas
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={focused ? hardShadow({ x: 2, y: 2, elevation: 3 }) : null}
            >
              <Entypo
                name="bowl"
                size={focused ? 30 : 24}
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          tabBarActiveTintColor: theme.colors.secondary,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AddRecipeScreen"
        component={AddRecipe}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontSize: focused ? 13 : 12,
                fontFamily: focused ? theme.fonts.bold : theme.fonts.medium,
                textShadowColor: theme.colors.primary,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 0,
                marginTop: -5,
              }}
            >
              Añadir receta
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={focused ? hardShadow({ x: 2, y: 2, elevation: 3 }) : null}
            >
              <Ionicons
                name="add-circle"
                size={focused ? 30 : 24}
                color={color}
                style={focused ? { marginBottom: -3 } : {}}
              />
            </View>
          ),
          tabBarActiveTintColor: theme.colors.success,
          headerShown: false,
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
