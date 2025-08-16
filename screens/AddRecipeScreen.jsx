import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddFormRecipe from "../components/AddFormRecipe";

const AddRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="notebook-plus"
          size={40}
          color="#8B4513"
          style={styles.icon}
        />
        <Text style={styles.text_title}>Añade una receta</Text>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll_container}
        keyboardShouldPersistTaps="handled"
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

    backgroundColor: "#FFF5E6",
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
  icon: {
    shadowColor: "#8B4513",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 5,
  },
  text_title: {
    color: "#663300",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  scroll_container: {
    paddingTop: 20,
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  form_container: {
    flexGrow: 1,
    marginTop: 10,
    marginBottom: 20,
  },
});
