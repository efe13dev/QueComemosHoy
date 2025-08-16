import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { GenerateMenu } from "../components/GenerateMenu";
import { theme, hardShadow } from "../utils/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Animatable.View
        animation="fadeInDown"
        duration={500}
        useNativeDriver
        style={styles.iconContainer}
      >
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={50}
            color={theme.colors.border}
            style={styles.iconShadow}
          />
          <MaterialCommunityIcons
            name="chef-hat"
            size={50}
            color={theme.colors.primary}
            style={styles.icon}
          />
        </View>
      </Animatable.View>
      <GenerateMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: theme.spacing.sm,
    ...hardShadow({ x: 2, y: 2, elevation: 4 }),
  },
  iconWrap: {
    position: "relative",
    width: 50,
    height: 50,
  },
  icon: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  iconShadow: {
    position: "absolute",
    left: 2,
    top: 2,
    zIndex: 0,
  },
});
