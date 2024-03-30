import { StyleSheet, View, Text } from 'react-native';
import AddFormRecipe from '../components/AddFormRecipe';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddRecipeScreen = () => {
  return (
    <KeyboardAwareScrollView
      // contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='handled'
    >
      <View style={styles.container}>
        <Text style={styles.text_title}>Añade una receta</Text>
        <AddFormRecipe />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddRecipeScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },

  text_title: {
    marginVertical: 10,
    marginBottom: 25,
    textShadowColor: 'blue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    color: '#7AA2E3',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40
  }
});
