import Constants from "expo-constants";
import { StatusBar, StyleSheet, View } from "react-native";
import * as Animatable from "react-native-animatable";

import { GenerateMenu } from "../components/GenerateMenu";
import NeoIcon from "../components/ui/NeoIcon";
import { theme } from "../utils/theme";

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
        <NeoIcon
          name="chef-hat"
          size={56}
          color={theme.colors.primary}
          shadowColor={theme.colors.border}
          shadowOffset={3}
        />
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
    paddingTop: Constants.statusBarHeight + 4,
    paddingBottom: theme.spacing.md,
  },
});
