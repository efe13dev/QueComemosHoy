import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

// Configuración de tabs con sus colores activos
const TAB_CONFIG = {
  Home: { label: "Inicio", activeColor: "#FF7A00", shadowColor: "#FF7A00" },
  MyRecipesScreen: {
    label: "Mis recetas",
    activeColor: theme.colors.secondary,
    shadowColor: theme.colors.primary,
  },
  AddRecipeScreen: {
    label: "Añadir receta",
    activeColor: theme.colors.success,
    shadowColor: theme.colors.primary,
  },
};

function TabLabel({ focused, color, routeName }) {
  const cfg = TAB_CONFIG[routeName];

  return (
    <Text
      style={[
        tabStyles.label,
        {
          color,
          fontSize: focused ? 13 : theme.fontSize.xs,
          fontFamily: focused ? theme.fonts.bold : theme.fonts.medium,
          textShadowColor: cfg?.shadowColor || theme.colors.primary,
          letterSpacing: focused ? 0.8 : 0.3,
        },
      ]}
    >
      {cfg?.label || routeName}
    </Text>
  );
}

function TabIcon({ focused, color, children }) {
  return (
    <View style={[tabStyles.iconWrap, focused ? tabStyles.iconFocused : null]}>
      {children}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.surfaceAlt,
    borderTopWidth: 4,
    borderTopColor: theme.colors.border,
    height: 68,
    paddingBottom: 6,
    paddingTop: 6,
    ...outline({ width: 3 }),
    ...hardShadow({ x: 0, y: -2, elevation: 8 }),
  },
  label: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginTop: -4,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 36,
  },
  iconFocused: {
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
    transform: [{ scale: 1.1 }],
  },
});

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: tabStyles.bar,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textDark,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel focused={focused} color={color} routeName="Home" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color}>
              <FontAwesome name="home" size={focused ? 28 : 24} color={color} />
            </TabIcon>
          ),
          tabBarActiveTintColor: TAB_CONFIG.Home.activeColor,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyRecipesScreen"
        component={RecipesStack}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              routeName="MyRecipesScreen"
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color}>
              <Entypo name="bowl" size={focused ? 28 : 24} color={color} />
            </TabIcon>
          ),
          tabBarActiveTintColor: TAB_CONFIG.MyRecipesScreen.activeColor,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AddRecipeScreen"
        component={AddRecipe}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <TabLabel
              focused={focused}
              color={color}
              routeName="AddRecipeScreen"
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} color={color}>
              <Ionicons
                name="add-circle"
                size={focused ? 28 : 24}
                color={color}
              />
            </TabIcon>
          ),
          tabBarActiveTintColor: TAB_CONFIG.AddRecipeScreen.activeColor,
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
