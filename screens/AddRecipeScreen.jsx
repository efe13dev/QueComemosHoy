import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddFormRecipe from "../components/AddFormRecipe";
import { theme } from "../utils/theme";

const AddRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="notebook-plus"
            size={40}
            color="#000000"
            style={[styles.iconBase, styles.iconShadow]}
          />
          <MaterialCommunityIcons
            name="notebook-plus"
            size={40}
            color={theme.colors.primary}
            style={[styles.iconBase, styles.iconMain]}
          />
        </View>
        <View style={styles.titleWrap}>
          <Text style={[styles.text_title, styles.titleShadow]}>
            Añade una receta
          </Text>
          <Text style={[styles.text_title, styles.titleShadow2]}>
            Añade una receta
          </Text>
          <Text style={[styles.text_title, styles.titleShadow3]}>
            Añade una receta
          </Text>
          <Text style={[styles.text_title, styles.titleShadow4]}>
            Añade una receta
          </Text>
          <Text style={styles.text_title}>Añade una receta</Text>
        </View>
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
  iconWrapper: {
    position: "relative",
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  iconBase: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  iconShadow: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
    zIndex: 0,
  },
  iconMain: {
    zIndex: 1,
  },
  titleWrap: {
    position: "relative",
    alignItems: "center",
    marginTop: 14,
  },
  text_title: {
    color: theme.colors.textDark,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginBottom: 0,
    zIndex: 1,
  },
  titleShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: theme.colors.primary,
    zIndex: 0,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  titleShadow2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: theme.colors.primary,
    zIndex: 0,
    transform: [{ translateX: -2 }, { translateY: 0 }],
  },
  titleShadow3: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: theme.colors.primary,
    zIndex: 0,
    transform: [{ translateX: 0 }, { translateY: -2 }],
  },
  titleShadow4: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: theme.colors.primary,
    zIndex: 0,
    transform: [{ translateX: -2 }, { translateY: -2 }],
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
