import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddFormRecipe from "../components/AddFormRecipe";
import NeoIcon from "../components/ui/NeoIcon";
import NeoTitle from "../components/ui/NeoTitle";
import { theme } from "../utils/theme";

const AddRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <NeoIcon
          name="notebook-plus"
          size={48}
          color={theme.colors.primary}
          shadowColor="#000000"
          shadowOffset={3}
        />
        <NeoTitle
          text="Añade una receta"
          fontSize={theme.fontSize.xl}
          shadowColor={theme.colors.primary}
          style={styles.titleSpacing}
        />
        <View style={styles.headerBar} />
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
    paddingTop: Constants.statusBarHeight + 4,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  titleSpacing: {
    marginTop: theme.spacing.sm,
  },
  headerBar: {
    width: 80,
    height: 5,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.xs,
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
