import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddFormRecipe from "../components/AddFormRecipe";
import { theme, hardShadow } from "../utils/theme";

const AddRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="notebook-plus"
          size={40}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <Text style={styles.text_title}>Añade una receta</Text>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll_container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={0}
      >
        <View style={styles.form_container}>
          <AddFormRecipe />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
  icon: {
    ...hardShadow({ color: theme.colors.primary, x: 2, y: 2, elevation: 3 }),
    marginBottom: 5,
  },
  text_title: {
    color: theme.colors.textDark,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scroll_container: {
    paddingTop: 20,
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 48,
  },
  form_container: {
    flexGrow: 1,
    marginTop: 10,
    marginBottom: 0,
  },
});
